// Coding Problem Database - Static content for testing
// This provides reliable coding problems without depending on Gemini API

export interface CodingProblem {
  title: string
  description: string
  examples: Array<{
    input: string
    output: string
    explanation: string
  }>
  testCases: Array<{
    input: string
    output: string
    description: string
  }>
  constraints: string[]
  hints: string[]
}

type ProblemKey = `${string}-${string}-${string}-${string}` // subject-unit-subtopic-difficulty

const codingProblemDatabase: Record<string, CodingProblem> = {
  // DSA - Arrays - Introduction - Basic
  'dsa-arrays-intro-basic': {
    title: 'Basic Problem: Find Maximum Element',
    description: 'Write a function to find the maximum element in an array. Given an array of integers, return the largest value.',
    examples: [
      {
        input: 'Sample input',
        output: 'Sample output',
        explanation: 'This demonstrates finding the maximum element in an array.'
      }
    ],
    testCases: [
      {
        input: 'Sample input',
        output: 'Sample output',
        description: 'Basic test case for finding maximum element'
      }
    ],
    constraints: [
      '1 <= array.length <= 100',
      '-1000 <= array[i] <= 1000'
    ],
    hints: [
      'Think about iterating through the array',
      'Keep track of the maximum value seen so far',
      'Compare each element with the current maximum'
    ]
  },

  // DSA - Arrays - Introduction - Medium
  'dsa-arrays-intro-medium': {
    title: 'Medium Problem: Two Sum',
    description: 'Given an array of integers and a target sum, find two numbers that add up to the target. Return the indices of these two numbers.',
    examples: [
      {
        input: 'Sample input',
        output: 'Sample output',
        explanation: 'This demonstrates finding two numbers that sum to the target.'
      }
    ],
    testCases: [
      {
        input: 'Sample input',
        output: 'Sample output',
        description: 'Medium test case for two sum problem'
      }
    ],
    constraints: [
      '2 <= array.length <= 10000',
      '-1000 <= array[i] <= 1000',
      '-1000 <= target <= 1000'
    ],
    hints: [
      'Consider using a hash map or dictionary',
      'Think about what complement you need for each number',
      'You can solve this in O(n) time complexity'
    ]
  },

  // DSA - Arrays - Introduction - Hard
  'dsa-arrays-intro-hard': {
    title: 'Hard Problem: Maximum Subarray Sum',
    description: 'Find the contiguous subarray (containing at least one number) which has the largest sum and return its sum. This is also known as Kadane\'s Algorithm.',
    examples: [
      {
        input: 'Sample input',
        output: 'Sample output',
        explanation: 'This demonstrates finding the maximum sum of a contiguous subarray.'
      }
    ],
    testCases: [
      {
        input: 'Sample input',
        output: 'Sample output',
        description: 'Hard test case for maximum subarray sum'
      }
    ],
    constraints: [
      '1 <= array.length <= 100000',
      '-10000 <= array[i] <= 10000'
    ],
    hints: [
      'Think about dynamic programming approach',
      'Consider what happens when you extend a subarray',
      'You can solve this in O(n) time with O(1) space'
    ]
  }
}

/**
 * Get coding problem for a specific subject, unit, subtopic, and difficulty
 */
export function getCodingProblem(
  subject: string,
  unit: string,
  subtopic: string,
  difficulty: 'Basic' | 'Medium' | 'Advanced'
): CodingProblem | null {
  // Normalize keys
  let normalizedSubject = subject.toLowerCase().replace(/\s+/g, '-')
  const normalizedUnit = unit.toLowerCase().replace(/\s+/g, '-')
  let normalizedSubtopic = subtopic.toLowerCase().replace(/\s+/g, '-')
  const normalizedDifficulty = difficulty.toLowerCase()
  
  // Handle subject name variations
  if (normalizedSubject.includes('data-structures') || normalizedSubject.includes('dsa')) {
    normalizedSubject = 'dsa'
  }
  
  // Handle subtopic name variations
  const subtopicMappings: Record<string, string> = {
    'introduction-to-arrays': 'intro',
    'introduction': 'intro',
    'intro': 'intro',
    'array-operations': 'operations',
    'operations': 'operations',
    'searching-in-arrays': 'searching',
    'searching': 'searching',
    'sorting-arrays': 'sorting',
    'sorting': 'sorting'
  }
  
  if (subtopicMappings[normalizedSubtopic]) {
    normalizedSubtopic = subtopicMappings[normalizedSubtopic]
  }
  
  // Map difficulty
  const difficultyMap: Record<string, string> = {
    'basic': 'basic',
    'medium': 'medium',
    'advanced': 'hard',
    'hard': 'hard'
  }
  
  const mappedDifficulty = difficultyMap[normalizedDifficulty] || 'basic'
  
  const key = `${normalizedSubject}-${normalizedUnit}-${normalizedSubtopic}-${mappedDifficulty}` as ProblemKey
  
  return codingProblemDatabase[key] || null
}

/**
 * Check if coding problem exists
 */
export function hasCodingProblem(
  subject: string,
  unit: string,
  subtopic: string,
  difficulty: 'Basic' | 'Medium' | 'Advanced'
): boolean {
  return getCodingProblem(subject, unit, subtopic, difficulty) !== null
}





