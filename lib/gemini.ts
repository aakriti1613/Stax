import { GoogleGenerativeAI } from '@google/generative-ai'

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not set in environment variables')
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export const geminiModel = genAI.getGenerativeModel({ model: 'gemini-pro' })

// Prompt Templates
export const PROMPT_TEMPLATES = {
  theory: (subject: string, unit: string) => `
You are an elite Computer Science educator. Generate comprehensive, engaging theory content for:
Subject: ${subject}
Unit: ${unit}

Requirements:
1. Write clear, beginner-friendly explanations
2. Include 2-3 code examples with detailed comments
3. Use analogies and real-world connections
4. Format with markdown (headers, code blocks, lists)
5. Keep it engaging and visual (describe what animations would show)
6. Length: 800-1200 words

Output format (JSON):
{
  "title": "Unit title",
  "overview": "Brief overview paragraph",
  "sections": [
    {
      "heading": "Section heading",
      "content": "Detailed explanation",
      "codeExample": "Code snippet with comments",
      "visualDescription": "What animation/visual would show here"
    }
  ],
  "keyTakeaways": ["point1", "point2", "point3"]
}
`,

  mcq: (subject: string, unit: string, concept: string) => `
Generate 5 high-quality Multiple Choice Questions (MCQs) for:
Subject: ${subject}
Unit: ${unit}
Concept: ${concept}

Requirements:
1. Questions should test deep understanding, not memorization
2. Include 4 options per question (only one correct)
3. Provide detailed explanations for correct answer
4. Include explanations for why wrong answers are incorrect
5. Difficulty: Mix of Basic and Medium

Output format (JSON array):
[
  {
    "question": "Question text",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": 0,
    "explanation": "Why this is correct",
    "wrongExplanations": {
      "1": "Why option B is wrong",
      "2": "Why option C is wrong",
      "3": "Why option D is wrong"
    },
    "difficulty": "Basic" | "Medium"
  }
]
`,

  codingProblem: (subject: string, unit: string, difficulty: 'Basic' | 'Medium' | 'Advanced') => `
Generate a coding problem for:
Subject: ${subject}
Unit: ${unit}
Difficulty: ${difficulty}

Requirements:
1. Problem statement should be clear and engaging
2. Include 2-3 example inputs/outputs with explanations
3. Provide constraints
4. DO NOT include solution code
5. Make it practical and relatable

Output format (JSON):
{
  "title": "Problem title",
  "description": "Detailed problem description",
  "examples": [
    {
      "input": "input example",
      "output": "output example",
      "explanation": "Why this output"
    }
  ],
  "constraints": ["constraint1", "constraint2"],
  "hints": ["hint1", "hint2"] // Progressive hints, not solutions
}
`,

  hint: (code: string, error: string, subject: string, unit: string) => `
A student is stuck on this code:
\`\`\`
${code}
\`\`\`

Error/Issue: ${error}
Subject: ${subject}
Unit: ${unit}

Provide a HINT (NOT the full solution):
1. Identify the problematic line/concept
2. Explain what's wrong conceptually
3. Guide them toward the solution
4. Reference the concept they should review
5. Keep it encouraging

DO NOT provide:
- Full corrected code
- Direct answers
- Complete solutions

Output format (JSON):
{
  "problematicLine": line number,
  "concept": "concept name",
  "explanation": "What's wrong and why",
  "hint": "Progressive hint text",
  "reviewConcept": "Concept to review"
}
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
}

export async function generateTheory(subject: string, unit: string) {
  const prompt = PROMPT_TEMPLATES.theory(subject, unit)
  const result = await geminiModel.generateContent(prompt)
  const response = await result.response
  const text = response.text()
  
  // Parse JSON from response
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    throw new Error('No JSON found in response')
  } catch (error) {
    console.error('Error parsing theory response:', error)
    // Fallback structure
    return {
      title: unit,
      overview: text.substring(0, 200),
      sections: [{ heading: 'Introduction', content: text, codeExample: '', visualDescription: '' }],
      keyTakeaways: []
    }
  }
}

export async function generateMCQs(subject: string, unit: string, concept: string) {
  const prompt = PROMPT_TEMPLATES.mcq(subject, unit, concept)
  const result = await geminiModel.generateContent(prompt)
  const response = await result.response
  const text = response.text()
  
  try {
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    throw new Error('No JSON array found')
  } catch (error) {
    console.error('Error parsing MCQ response:', error)
    return []
  }
}

export async function generateCodingProblem(
  subject: string,
  unit: string,
  difficulty: 'Basic' | 'Medium' | 'Advanced'
) {
  const prompt = PROMPT_TEMPLATES.codingProblem(subject, unit, difficulty)
  const result = await geminiModel.generateContent(prompt)
  const response = await result.response
  const text = response.text()
  
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    throw new Error('No JSON found')
  } catch (error) {
    console.error('Error parsing coding problem:', error)
    return null
  }
}

export async function generateHint(
  code: string,
  error: string,
  subject: string,
  unit: string
) {
  const prompt = PROMPT_TEMPLATES.hint(code, error, subject, unit)
  const result = await geminiModel.generateContent(prompt)
  const response = await result.response
  const text = response.text()
  
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    throw new Error('No JSON found')
  } catch (error) {
    console.error('Error parsing hint:', error)
    return { hint: text, concept: unit }
  }
}

export async function reTeachConcept(
  concept: string,
  subject: string,
  previousExplanation: string
) {
  const prompt = PROMPT_TEMPLATES.reTeach(concept, subject, previousExplanation)
  const result = await geminiModel.generateContent(prompt)
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

export async function generateReinforcementMCQ(concept: string, subject: string) {
  const prompt = PROMPT_TEMPLATES.reinforcementMCQ(concept, subject)
  const result = await geminiModel.generateContent(prompt)
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


