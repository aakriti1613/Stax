import { GoogleGenerativeAI } from '@google/generative-ai'

// Get API key - don't throw error at module load, handle it in functions
function getApiKey(): string {
  const apiKey = process.env.GEMINI_API_KEY
  
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set in environment variables. Please add it to your .env.local file')
  }
  
  // Validate API key format (warning only, not blocking)
  if (!apiKey.startsWith('AIza')) {
    console.warn('⚠️ API key format may be incorrect. Gemini keys usually start with "AIza"')
  }
  
  return apiKey
}

// Initialize genAI lazily
let genAIInstance: GoogleGenerativeAI | null = null

function getGenAI(): GoogleGenerativeAI {
  if (!genAIInstance) {
    const apiKey = getApiKey()
    genAIInstance = new GoogleGenerativeAI(apiKey)
  }
  return genAIInstance
}

// Function to find a working model
async function findWorkingModel() {
  // Try gemini-flash-2.5 first (user requested), then other models
  const modelsToTry = [
    'gemini-2.5-flash',
    'gemini-flash-2.5',
    'gemini-2.5-flash-latest',
    'gemini-flash-2.5-latest',
    'models/gemini-2.5-flash',
    'models/gemini-flash-2.5',
    'gemini-2.0-flash-exp',
    'gemini-1.5-flash',
    'gemini-1.5-pro',
    'gemini-pro',
    'gemini-1.0-pro',
    'models/gemini-2.0-flash-exp',
    'models/gemini-1.5-flash',
    'models/gemini-1.5-pro',
    'models/gemini-pro',
    'gemini-1.5-flash-latest',
    'gemini-1.5-pro-latest',
    'gemini-1.5-flash-001',
    'gemini-1.5-pro-001'
  ]

  const errors: string[] = []

  const genAI = getGenAI()
  
  for (const modelName of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName })
      // Test if model works by making a simple request
      const result = await model.generateContent('Say "test"')
      const response = await result.response
      const text = response.text()
      
      if (text && text.trim().length > 0) {
        console.log(`✅ Found working model: ${modelName}`)
        return { model, modelName }
      } else {
        errors.push(`${modelName}: Empty response`)
      }
    } catch (error: any) {
      const errorMsg = error.message || 'Unknown error'
      console.log(`❌ Model ${modelName} failed: ${errorMsg.substring(0, 150)}`)
      errors.push(`${modelName}: ${errorMsg.substring(0, 100)}`)
      continue
    }
  }
  
  // If all models failed, throw detailed error
  throw new Error(
    `No working Gemini model found. Tried: ${modelsToTry.join(', ')}. ` +
    `Errors: ${errors.join('; ')}. ` +
    `Please check: 1) Your API key is valid, 2) API key has access to Gemini models, 3) Billing is enabled if required, 4) Visit https://aistudio.google.com/ to see available models`
  )
}

// Initialize model - will be set on first use
let geminiModelInstance: any = null
let modelName: string | null = null
let modelInitialized = false
let initializationError: Error | null = null

// Get or initialize the model
export async function getGeminiModel() {
  if (initializationError) {
    throw initializationError
  }
  
  if (!modelInitialized) {
    try {
      const result = await findWorkingModel()
      geminiModelInstance = result.model
      modelName = result.modelName
      modelInitialized = true
    } catch (error: any) {
      initializationError = error
      throw error
    }
  }
  return geminiModelInstance
}

// Get the model name being used
export function getModelName() {
  return modelName || 'Not initialized'
}

// Prompt Templates
export const PROMPT_TEMPLATES = {
  theory: (subject: string, unit: string) => `
You are an elite Computer Science educator. Generate comprehensive, engaging theory content for:
Subject: ${subject}
Unit: ${unit}

IMPORTANT: You MUST respond with ONLY valid JSON. Do not include any markdown code blocks, explanations, or extra text. Start directly with { and end with }.

Requirements:
1. Write clear, beginner-friendly explanations (at least 300 words per section)
2. Include 2-3 code examples with detailed comments
3. Use analogies and real-world connections
4. Keep it engaging and visual (describe what animations would show)
5. Create 3-5 sections with substantial content

Output ONLY this JSON structure (no markdown, no code blocks, just pure JSON):
{
  "title": "${unit}",
  "overview": "A comprehensive overview of ${unit} in ${subject} (at least 200 words explaining what this topic is, why it's important, and what students will learn)",
  "sections": [
    {
      "heading": "Introduction to ${unit}",
      "content": "Detailed explanation of ${unit} (at least 300 words). Explain what it is, how it works, why it matters. Use examples and analogies.",
      "codeExample": "// Practical code example demonstrating ${unit}\n// Include complete, working code with comments",
      "visualDescription": "Describe a visual diagram or animation that would help explain this concept"
    },
    {
      "heading": "Key Concepts and Principles",
      "content": "Explain the fundamental concepts (at least 300 words). Break down complex ideas into simple terms.",
      "codeExample": "// Another code example showing practical application",
      "visualDescription": "Visual representation of the concepts"
    },
    {
      "heading": "Practical Applications",
      "content": "Show real-world uses and applications (at least 200 words). Give concrete examples.",
      "codeExample": "// Real-world code example",
      "visualDescription": "How this is used in practice"
    }
  ],
  "keyTakeaways": [
    "First important takeaway about ${unit}",
    "Second key concept to remember",
    "Third practical application tip"
  ]
}

Remember: Output ONLY the JSON object, nothing else.
`,

  mcq: (subject: string, unit: string, concept: string) => `
Generate 5 high-quality Multiple Choice Questions (MCQs) for:
Subject: ${subject}
Unit: ${unit}
Concept: ${concept}

IMPORTANT: You MUST respond with ONLY valid JSON array. Do not include any markdown code blocks, explanations, or extra text. Start directly with [ and end with ].

Requirements:
1. Questions should test deep understanding, not memorization
2. Include 4 options per question (only one correct)
3. Provide detailed explanations for correct answer (at least 50 words)
4. Include explanations for why wrong answers are incorrect
5. Difficulty: Mix of Basic and Medium
6. Make questions specific to ${concept} in ${subject}

Output ONLY this JSON array (no markdown, no code blocks, just pure JSON):
[
  {
    "question": "A specific, detailed question about ${concept} that tests understanding",
    "options": [
      "First option (should be detailed, not just 'A')",
      "Second option (detailed)",
      "Third option (detailed)",
      "Fourth option (detailed)"
    ],
    "correctAnswer": 0,
    "explanation": "Detailed explanation (at least 50 words) of why this answer is correct, including concepts and reasoning",
    "wrongExplanations": {
      "1": "Why the second option is incorrect",
      "2": "Why the third option is incorrect",
      "3": "Why the fourth option is incorrect"
    },
    "difficulty": "Basic"
  }
]

Generate exactly 5 questions. Remember: Output ONLY the JSON array, nothing else.
`,

  codingProblem: (subject: string, unit: string, difficulty: 'Basic' | 'Medium' | 'Advanced') => `
Generate a coding problem for:
Subject: ${subject}
Unit: ${unit}
Difficulty: ${difficulty}

IMPORTANT: You MUST respond with ONLY valid JSON. Do not include any markdown code blocks, explanations, or extra text. Start directly with { and end with }.

Requirements:
1. Problem statement should be clear, engaging, and detailed (at least 300 words)
2. Include 3-4 comprehensive example inputs/outputs with detailed explanations (at least 100 words per explanation)
3. Provide clear constraints (at least 3-5 constraints)
4. Include test cases that cover edge cases (at least 3-4 test cases)
5. DO NOT include solution code
6. Make it practical and relatable to ${unit} in ${subject}
7. For ${difficulty} level, adjust complexity appropriately

Output ONLY this JSON structure (no markdown, no code blocks, just pure JSON):
{
  "title": "A specific, engaging problem title related to ${unit}",
  "description": "Very detailed problem description (at least 300 words). Explain the problem clearly, provide context, describe what the solution should do, and why it's important. Make it engaging and educational.",
  "examples": [
    {
      "input": "Specific input example (show actual values)",
      "output": "Expected output for that input",
      "explanation": "Detailed step-by-step explanation (at least 100 words) of why this output is correct, walking through the logic and reasoning"
    },
    {
      "input": "Another input example",
      "output": "Expected output",
      "explanation": "Detailed explanation of this example"
    },
    {
      "input": "Third input example",
      "output": "Expected output",
      "explanation": "Detailed explanation"
    }
  ],
  "testCases": [
    {
      "input": "Test case 1 input (edge case)",
      "output": "Expected output",
      "description": "What this test case validates (e.g., 'Tests empty input', 'Tests maximum value', 'Tests negative numbers')"
    },
    {
      "input": "Test case 2 input",
      "output": "Expected output",
      "description": "What this validates"
    },
    {
      "input": "Test case 3 input",
      "output": "Expected output",
      "description": "What this validates"
    }
  ],
  "constraints": [
    "Constraint 1 (be specific, e.g., '1 <= n <= 10^5')",
    "Constraint 2",
    "Constraint 3",
    "Constraint 4"
  ],
  "hints": [
    "First progressive hint (guides thinking, not solution)",
    "Second hint (more specific guidance)",
    "Third hint (conceptual direction)"
  ]
}

Remember: Output ONLY the JSON object, nothing else.
`,

  hint: (code: string, error: string, subject: string, unit: string) => `
A student is stuck on this code:
\`\`\`
${code}
\`\`\`

Error/Issue: ${error}
Subject: ${subject}
Unit: ${unit}

IMPORTANT: You MUST respond with ONLY valid JSON. Do not include any markdown code blocks, explanations, or extra text. Start directly with { and end with }.

Provide a HINT (NOT the full solution):
1. Identify the problematic line/concept (analyze the code carefully)
2. Explain what's wrong conceptually (at least 100 words)
3. Guide them toward the solution (progressive hint, not direct answer)
4. Reference the concept they should review
5. Keep it encouraging and educational

DO NOT provide:
- Full corrected code
- Direct answers
- Complete solutions

Output ONLY this JSON structure (no markdown, no code blocks, just pure JSON):
{
  "problematicLine": <line number where the issue likely is>,
  "concept": "The specific concept from ${unit} that's causing the issue",
  "explanation": "Detailed explanation (at least 100 words) of what's wrong and why. Explain the conceptual error, not just the syntax error. Help them understand the underlying issue.",
  "hint": "A progressive hint (at least 50 words) that guides them toward the solution without giving it away. Suggest what to think about or what approach to consider.",
  "reviewConcept": "Specific concept from ${unit} they should review to understand this better"
}

Remember: Output ONLY the JSON object, nothing else.
`,

  reTeach: (concept: string, subject: string, previousExplanation: string) => `
A student failed to understand this concept:
Concept: ${concept}
Subject: ${subject}
Previous explanation: ${previousExplanation}

Generate a SIMPLIFIED, more intuitive explanation:
1. Use simpler language
2. Add more analogies
3. Break into smaller steps
4. Include visual descriptions
5. Make it more engaging

Output format (JSON):
{
  "simplifiedExplanation": "Simpler explanation",
  "analogy": "Real-world analogy",
  "stepByStep": ["step1", "step2", "step3"],
  "visualDescription": "What to visualize"
}
`,

  reinforcementMCQ: (concept: string, subject: string) => `
Generate ONE reinforcement MCQ to test understanding of:
Concept: ${concept}
Subject: ${subject}

This is for a student who just failed a question on this concept.
Make it simpler but still test understanding.

Output format (JSON):
{
  "question": "Question text",
  "options": ["A", "B", "C", "D"],
  "correctAnswer": 0,
  "explanation": "Detailed explanation"
}
`,

  personalizedAssignment: (
    subject: string,
    unit: string,
    subtopic: string,
    masteryLevel: number,
    performanceMetrics: {
      basicSolved: number
      mediumSolved: number
      hardSolved: number
      averageTime: number
      codeQuality: 'low' | 'medium' | 'high'
    }
  ) => `
Generate a PERSONALIZED coding assignment based on the student's performance and mastery level.

Subject: ${subject}
Unit: ${unit}
Subtopic: ${subtopic}
Mastery Level: ${(masteryLevel * 100).toFixed(1)}% (0.0 to 1.0)
Performance Metrics:
- Basic problems solved: ${performanceMetrics.basicSolved}
- Medium problems solved: ${performanceMetrics.mediumSolved}
- Hard problems solved: ${performanceMetrics.hardSolved}
- Average solving time: ${performanceMetrics.averageTime} minutes
- Code quality: ${performanceMetrics.codeQuality}

Based on these metrics, generate an assignment that:
1. Matches their current skill level (mastery level)
2. Challenges them appropriately (slightly above current level)
3. Reinforces weak areas if mastery is low
4. Introduces advanced concepts if mastery is high
5. Is personalized to their learning pace

IMPORTANT: You MUST respond with ONLY valid JSON. Do not include any markdown code blocks, explanations, or extra text. Start directly with { and end with }.

Output ONLY this JSON structure (no markdown, no code blocks, just pure JSON):
{
  "title": "Personalized assignment title based on their level",
  "description": "Detailed problem description (at least 300 words) that is tailored to their mastery level. If mastery is low, explain more. If mastery is high, make it more challenging.",
  "targetDifficulty": "${masteryLevel < 0.4 ? 'Basic' : masteryLevel < 0.7 ? 'Medium' : 'Advanced'}",
  "personalizedNote": "A note explaining why this assignment was chosen for them based on their performance",
  "examples": [
    {
      "input": "Specific input example",
      "output": "Expected output",
      "explanation": "Detailed explanation tailored to their understanding level"
    },
    {
      "input": "Another example",
      "output": "Expected output",
      "explanation": "Explanation"
    }
  ],
  "testCases": [
    {
      "input": "Test case 1 input",
      "output": "Expected output",
      "description": "What this test case validates"
    },
    {
      "input": "Test case 2 input",
      "output": "Expected output",
      "description": "What this validates"
    },
    {
      "input": "Test case 3 input",
      "output": "Expected output",
      "description": "What this validates"
    }
  ],
  "constraints": [
    "Constraint 1",
    "Constraint 2",
    "Constraint 3"
  ],
  "hints": [
    "First hint (appropriate for their level)",
    "Second hint",
    "Third hint"
  ],
  "learningObjectives": [
    "Objective 1 based on their weak areas",
    "Objective 2",
    "Objective 3"
  ]
}

Remember: Output ONLY the JSON object, nothing else.
`,
}

export async function generateTheory(subject: string, unit: string) {
  try {
    const prompt = PROMPT_TEMPLATES.theory(subject, unit)
    console.log('Generating theory for:', subject, unit)
    
    const model = await getGeminiModel()
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text().trim()
    
    console.log('Gemini response length:', text.length)
    console.log('First 500 chars:', text.substring(0, 500))
    console.log('Last 200 chars:', text.substring(Math.max(0, text.length - 200)))
    
    // Clean the text - remove markdown code blocks, extra whitespace
    let jsonText = text.trim()
    
    // Remove markdown code blocks if present
    jsonText = jsonText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()
    
    // Find JSON object - look for first { and last }
    const firstBrace = jsonText.indexOf('{')
    const lastBrace = jsonText.lastIndexOf('}')
    
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      jsonText = jsonText.substring(firstBrace, lastBrace + 1)
    }
    
    // Parse JSON
    try {
      const parsed = JSON.parse(jsonText)
      console.log('✅ Successfully parsed theory JSON')
      console.log('Title:', parsed.title)
      console.log('Sections count:', parsed.sections?.length || 0)
      
      // Validate structure
      if (!parsed.title || !parsed.sections || !Array.isArray(parsed.sections)) {
        throw new Error('Invalid structure in parsed JSON')
      }
      
      return parsed
    } catch (parseError: any) {
      console.error('❌ Error parsing theory JSON:', parseError.message)
      console.log('Attempted to parse (first 1000 chars):', jsonText.substring(0, 1000))
      
      // Try to extract content from raw text as fallback
      const rawText = text
      const sections = rawText.split(/\n\n+/).filter(s => s.trim().length > 50)
      
      if (sections.length > 0) {
        console.log('Using extracted content from text')
        return {
          title: unit,
          overview: sections[0]?.substring(0, 400) || `Learn about ${unit} in ${subject}`,
          sections: sections.slice(0, 5).map((section, idx) => {
            const lines = section.split('\n')
            const heading = lines[0]?.replace(/^#+\s*/, '') || `Section ${idx + 1}`
            const content = lines.slice(1).join('\n') || section
            const codeMatch = content.match(/```[\s\S]*?```/g)
            
            return {
              heading: heading.substring(0, 100),
              content: content.replace(/```[\s\S]*?```/g, '').substring(0, 1500),
              codeExample: codeMatch?.[0]?.replace(/```\w*\n?/g, '') || '',
              visualDescription: 'Visual representation of the concept'
            }
          }),
          keyTakeaways: sections.slice(-3).map(s => s.substring(0, 150))
        }
      }
      
      throw parseError
    }
  } catch (error: any) {
    console.error('❌ Error generating theory:', error.message)
    console.error('Full error:', error)
    
    // Only return fallback if it's a real API error, not a parsing error with content
    throw error
  }
}

export async function generateMCQs(subject: string, unit: string, concept: string) {
  try {
    const prompt = PROMPT_TEMPLATES.mcq(subject, unit, concept)
    console.log('📝 Generating MCQs for:', subject, unit, concept)
    
    const model = await getGeminiModel()
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text().trim()
    
    console.log('MCQ response length:', text.length)
    console.log('First 500 chars:', text.substring(0, 500))
    
    // Clean the text - remove markdown code blocks
    let jsonText = text.trim()
    jsonText = jsonText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()
    
    // Find JSON array - look for first [ and last ]
    const firstBracket = jsonText.indexOf('[')
    const lastBracket = jsonText.lastIndexOf(']')
    
    if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
      jsonText = jsonText.substring(firstBracket, lastBracket + 1)
    }
    
    try {
      const parsed = JSON.parse(jsonText)
      console.log('✅ Successfully parsed MCQ JSON, count:', parsed.length)
      
      // Validate and format MCQs
      if (Array.isArray(parsed) && parsed.length > 0) {
        const formatted = parsed.map((mcq: any, idx: number) => ({
          question: mcq.question || `Question ${idx + 1}`,
          options: Array.isArray(mcq.options) && mcq.options.length === 4 
            ? mcq.options 
            : ['Option A', 'Option B', 'Option C', 'Option D'],
          correctAnswer: typeof mcq.correctAnswer === 'number' ? mcq.correctAnswer : 0,
          explanation: mcq.explanation || 'Explanation',
          wrongExplanations: mcq.wrongExplanations || {},
          difficulty: mcq.difficulty || 'Basic'
        }))
        
        console.log('Formatted MCQs:', formatted.length)
        return formatted
      }
      
      throw new Error('Invalid MCQ format - not an array or empty')
    } catch (parseError: any) {
      console.error('❌ Error parsing MCQ response:', parseError.message)
      console.log('Attempted to parse (first 1000 chars):', jsonText.substring(0, 1000))
      throw parseError
    }
  } catch (error: any) {
    console.error('❌ Error generating MCQs:', error.message)
    console.error('Full error:', error)
    throw error
  }
}

export async function generateCodingProblem(
  subject: string,
  unit: string,
  difficulty: 'Basic' | 'Medium' | 'Advanced'
) {
  try {
    const prompt = PROMPT_TEMPLATES.codingProblem(subject, unit, difficulty)
    console.log('Generating coding problem for:', subject, unit, difficulty)
    console.log('Using model: gemini-pro')
    
    const model = await getGeminiModel()
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text().trim()
    
    console.log('Coding problem response length:', text.length)
    console.log('First 500 chars:', text.substring(0, 500))
    
    // Clean the text - remove markdown code blocks
    let jsonText = text.trim()
    jsonText = jsonText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()
    
    // Find JSON object - look for first { and last }
    const firstBrace = jsonText.indexOf('{')
    const lastBrace = jsonText.lastIndexOf('}')
    
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      jsonText = jsonText.substring(firstBrace, lastBrace + 1)
    }
    
    try {
      const parsed = JSON.parse(jsonText)
      console.log('✅ Successfully parsed coding problem JSON')
      console.log('Title:', parsed.title)
      console.log('Examples count:', parsed.examples?.length || 0)
      console.log('Test cases count:', parsed.testCases?.length || 0)
      
      // Validate structure
      if (!parsed.title || !parsed.description) {
        throw new Error('Invalid structure - missing title or description')
      }
      
      // Ensure all required fields exist
      return {
        title: parsed.title || `${difficulty} Problem: ${unit}`,
        description: parsed.description || `Solve a ${difficulty.toLowerCase()} level problem`,
        examples: parsed.examples || [],
        testCases: parsed.testCases || [],
        constraints: parsed.constraints || [],
        hints: parsed.hints || []
      }
    } catch (parseError: any) {
      console.error('❌ Error parsing coding problem JSON:', parseError.message)
      console.log('Attempted to parse (first 1000 chars):', jsonText.substring(0, 1000))
      throw parseError
    }
  } catch (error: any) {
    console.error('❌ Error generating coding problem:', error.message)
    console.error('Full error:', error)
    throw error
  }
}

export async function generateHint(
  code: string,
  error: string,
  subject: string,
  unit: string
) {
  try {
    const prompt = PROMPT_TEMPLATES.hint(code, error, subject, unit)
    console.log('Generating hint for:', subject, unit)
    console.log('Code length:', code.length, 'Error:', error)
    console.log('Using model: gemini-pro')
    
    const model = await getGeminiModel()
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text().trim()
    
    console.log('Hint response length:', text.length)
    console.log('First 500 chars:', text.substring(0, 500))
    
    // Clean the text - remove markdown code blocks
    let jsonText = text.trim()
    jsonText = jsonText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()
    
    // Find JSON object - look for first { and last }
    const firstBrace = jsonText.indexOf('{')
    const lastBrace = jsonText.lastIndexOf('}')
    
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      jsonText = jsonText.substring(firstBrace, lastBrace + 1)
    }
    
    try {
      const parsed = JSON.parse(jsonText)
      console.log('✅ Successfully parsed hint JSON')
      console.log('Problematic line:', parsed.problematicLine)
      console.log('Concept:', parsed.concept)
      
      // Validate and format hint
      return {
        problematicLine: typeof parsed.problematicLine === 'number' ? parsed.problematicLine : 1,
        concept: parsed.concept || unit,
        explanation: parsed.explanation || 'Review your code logic',
        hint: parsed.hint || 'Check your code for logical errors',
        reviewConcept: parsed.reviewConcept || unit
      }
    } catch (parseError: any) {
      console.error('❌ Error parsing hint JSON:', parseError.message)
      console.log('Attempted to parse (first 1000 chars):', jsonText.substring(0, 1000))
      
      // Extract meaningful hint from text if JSON parsing fails
      const lines = code.split('\n')
      const estimatedLine = Math.max(1, Math.floor(lines.length / 2))
      
      // Use the actual text response as hint content
      const hintText = text.length > 0 ? text : 'Review your code and check for errors'
      
      return {
        problematicLine: estimatedLine,
        concept: unit,
        explanation: hintText.substring(0, 400) || 'Review your code logic',
        hint: hintText.substring(0, 500) || 'Check your code for logical errors',
        reviewConcept: unit
      }
    }
  } catch (error: any) {
    console.error('❌ Error generating hint:', error.message)
    console.error('Full error:', error)
    throw error
  }
}

export async function reTeachConcept(
  concept: string,
  subject: string,
  previousExplanation: string
) {
  const prompt = PROMPT_TEMPLATES.reTeach(concept, subject, previousExplanation)
  const model = await getGeminiModel()
  const result = await model.generateContent(prompt)
  const response = await result.response
  const text = response.text()
  
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    throw new Error('No JSON found')
  } catch (error) {
    console.error('Error parsing re-teach:', error)
    return { simplifiedExplanation: text }
  }
}

export async function generatePersonalizedAssignment(
  subject: string,
  unit: string,
  subtopic: string,
  masteryLevel: number = 0.5,
  performanceMetrics: {
    basicSolved: number
    mediumSolved: number
    hardSolved: number
    averageTime: number
    codeQuality: 'low' | 'medium' | 'high'
  } = {
    basicSolved: 0,
    mediumSolved: 0,
    hardSolved: 0,
    averageTime: 10,
    codeQuality: 'medium'
  }
) {
  try {
    const prompt = PROMPT_TEMPLATES.personalizedAssignment(
      subject,
      unit,
      subtopic,
      masteryLevel,
      performanceMetrics
    )
    console.log('🎯 Generating personalized assignment for:', subject, unit, subtopic)
    console.log('Mastery level:', masteryLevel)
    
    const model = await getGeminiModel()
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text().trim()
    
    console.log('Assignment response length:', text.length)
    
    // Clean the text - remove markdown code blocks
    let jsonText = text.trim()
    jsonText = jsonText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()
    
    // Find JSON object
    const firstBrace = jsonText.indexOf('{')
    const lastBrace = jsonText.lastIndexOf('}')
    
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      jsonText = jsonText.substring(firstBrace, lastBrace + 1)
    }
    
    try {
      const parsed = JSON.parse(jsonText)
      console.log('✅ Successfully parsed assignment JSON')
      console.log('Title:', parsed.title)
      
      return parsed
    } catch (parseError: any) {
      console.error('❌ Error parsing assignment JSON:', parseError.message)
      throw parseError
    }
  } catch (error: any) {
    console.error('❌ Error generating personalized assignment:', error.message)
    throw error
  }
}

export async function generateReinforcementMCQ(concept: string, subject: string) {
  const prompt = PROMPT_TEMPLATES.reinforcementMCQ(concept, subject)
  const model = await getGeminiModel()
  const result = await model.generateContent(prompt)
  const response = await result.response
  const text = response.text()
  
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    throw new Error('No JSON found')
  } catch (error) {
    console.error('Error parsing reinforcement MCQ:', error)
    return null
  }
}


