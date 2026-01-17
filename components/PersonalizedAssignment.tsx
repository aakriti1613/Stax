'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import axios from 'axios'
import { Play, Loader2, AlertCircle, Lightbulb, CheckCircle2, Sparkles, Target } from 'lucide-react'
import toast from 'react-hot-toast'
import confetti from 'canvas-confetti'

// Dynamically import Monaco to avoid SSR issues
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => <div className="h-96 bg-dark-card animate-pulse rounded-lg" />,
})

interface Assignment {
  title: string
  description: string
  targetDifficulty: 'Basic' | 'Medium' | 'Advanced'
  personalizedNote: string
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
  learningObjectives: string[]
  verified?: boolean
  verificationFeedback?: string
  verificationIssues?: string[]
  verificationSuggestions?: string[]
}

interface PersonalizedAssignmentProps {
  subject: string
  unit: string
  subtopic: string
  onComplete: () => void
}

export default function PersonalizedAssignment({
  subject,
  unit,
  subtopic,
  onComplete,
}: PersonalizedAssignmentProps) {
  const [assignment, setAssignment] = useState<Assignment | null>(null)
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(true)
  const [executing, setExecuting] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [testResults, setTestResults] = useState<Array<{ 
    passed: boolean
    input: string
    expected: string
    got: string
    status?: string
    error?: string | null
  }>>([])
  const [currentHintIndex, setCurrentHintIndex] = useState(0)
  const [showHints, setShowHints] = useState(false)

  // Language templates
  const languageTemplates: Record<string, string> = {
    cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    // Your code here
    
    return 0;
}`,
    java: `public class Solution {
    public static void main(String[] args) {
        // Your code here
    }
}`,
    python: `# Your code here
`,
  }

  const [language, setLanguage] = useState('python')

  useEffect(() => {
    fetchAssignment()
    setCode(languageTemplates[language])
  }, [])

  // Calculate mastery level and performance metrics (mock for now, would come from database)
  const calculateMasteryLevel = (): number => {
    // In real app, this would be calculated from user's past performance
    // For now, return a default value
    return 0.5
  }

  const getPerformanceMetrics = () => {
    // In real app, this would come from database
    return {
      basicSolved: 3,
      mediumSolved: 2,
      hardSolved: 1,
      averageTime: 15,
      codeQuality: 'medium' as 'low' | 'medium' | 'high'
    }
  }

  const fetchAssignment = async () => {
    try {
      setLoading(true)
      const masteryLevel = calculateMasteryLevel()
      const performanceMetrics = getPerformanceMetrics()

      console.log('📚 Fetching personalized assignment...', {
        subject,
        unit,
        subtopic,
        masteryLevel,
        performanceMetrics
      })

      const response = await axios.post('/api/gemini/assignment', {
        subject,
        unit,
        subtopic,
        masteryLevel,
        performanceMetrics,
      })

      if (response.data?.assignment) {
        console.log('✅ Assignment received:', response.data.assignment.title)
        setAssignment(response.data.assignment)
        setCode(languageTemplates[language])
        setError(null)
        setTestResults([])
        
        // Show verification status
        if (response.data.assignment.verified === false) {
          toast.warning('Assignment has some issues but is still usable')
        } else {
          toast.success('Personalized assignment generated and verified!')
        }
      } else if (response.data?.error) {
        const errorMsg = response.data.error
        const suggestion = response.data.suggestion || ''
        
        // Show detailed error with suggestion
        if (errorMsg.includes('API key') || errorMsg.includes('GEMINI_API_KEY')) {
          toast.error(`${errorMsg} ${suggestion}`, { duration: 6000 })
        } else {
          toast.error(errorMsg)
        }
        
        throw new Error(errorMsg)
      } else {
        throw new Error('Invalid response format')
      }
    } catch (error: any) {
      console.error('Error fetching assignment:', error)
      const errorMessage = error.response?.data?.error || error.message || 'Failed to load assignment'
      toast.error(errorMessage)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleRunCode = async () => {
    if (!code.trim()) {
      toast.error('Please write some code first!')
      return
    }

    setExecuting(true)
    setTestResults([])

    try {
      const response = await axios.post('/api/judge0/execute', {
        code,
        language,
        testCases: assignment?.testCases || [],
      })

      if (response.data.results) {
        const results = response.data.results.map((result: any, index: number) => ({
          passed: result.status?.id === 3, // Accepted
          input: assignment?.testCases[index]?.input || '',
          expected: assignment?.testCases[index]?.output || '',
          got: result.stdout || result.stderr || 'No output',
          status: result.status?.description || 'Unknown',
          error: result.stderr || result.compile_output || null,
        }))

        setTestResults(results)

        const allPassed = results.every((r: any) => r.passed)
        if (allPassed) {
          setCompleted(true)
          toast.success('🎉 All test cases passed! Assignment completed!')
          
          // Confetti celebration
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          })

          setTimeout(() => {
            onComplete()
          }, 2000)
        } else {
          const passedCount = results.filter((r: any) => r.passed).length
          toast.error(`${passedCount}/${results.length} test cases passed. Keep trying!`)
        }
      }
    } catch (error: any) {
      console.error('Error executing code:', error)
      toast.error(error.response?.data?.error || 'Failed to execute code')
    } finally {
      setExecuting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader2 className="w-16 h-16 text-neon-cyan animate-spin mx-auto mb-4" />
          <p className="text-xl text-gray-400">Generating your personalized assignment...</p>
          <p className="text-sm text-gray-500 mt-2">This may take a moment</p>
        </motion.div>
      </div>
    )
  }

  if (error && !assignment) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 max-w-2xl text-center"
        >
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Failed to Load Assignment</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button onClick={fetchAssignment} className="btn-primary">
            Try Again
          </button>
        </motion.div>
      </div>
    )
  }

  if (!assignment) return null

  return (
    <div className="min-h-screen p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* Header with Personalized Note */}
        <div className="glass-card p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-neon-purple/20 rounded-lg">
              <Sparkles className="w-8 h-8 text-neon-purple" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold neon-text mb-2">{assignment.title}</h1>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-neon-cyan/20 border border-neon-cyan rounded-full text-sm">
                  {assignment.targetDifficulty} Level
                </span>
                {assignment.verified && (
                  <span className="px-3 py-1 bg-green-500/20 border border-green-500 rounded-full text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Verified
                  </span>
                )}
              </div>
              <div className="bg-neon-purple/10 border border-neon-purple/30 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-2">
                  <Target className="w-5 h-5 text-neon-purple mt-0.5" />
                  <div>
                    <p className="font-semibold text-neon-purple mb-1">Personalized for You</p>
                    <p className="text-gray-300 text-sm">{assignment.personalizedNote}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold mb-4">Problem Description</h2>
          <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
            {assignment.description}
          </p>
        </div>

        {/* Learning Objectives */}
        {assignment.learningObjectives && assignment.learningObjectives.length > 0 && (
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold mb-4">Learning Objectives</h2>
            <ul className="space-y-2">
              {assignment.learningObjectives.map((objective, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-neon-green mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">{objective}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Examples */}
        {assignment.examples && assignment.examples.length > 0 && (
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold mb-4">Examples</h2>
            <div className="space-y-4">
              {assignment.examples.map((example, idx) => (
                <div key={idx} className="bg-dark-bg/50 rounded-lg p-4 border border-gray-700">
                  <div className="grid grid-cols-2 gap-4 mb-2">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Input</p>
                      <p className="text-white font-mono text-sm">{example.input}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Output</p>
                      <p className="text-white font-mono text-sm">{example.output}</p>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm mt-2">{example.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Constraints */}
        {assignment.constraints && assignment.constraints.length > 0 && (
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold mb-4">Constraints</h2>
            <ul className="space-y-2">
              {assignment.constraints.map((constraint, idx) => (
                <li key={idx} className="text-gray-300 flex items-start gap-2">
                  <span className="text-neon-cyan">•</span>
                  <span>{constraint}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Code Editor */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Your Solution</h2>
            <div className="flex items-center gap-3">
              <select
                value={language}
                onChange={(e) => {
                  setLanguage(e.target.value)
                  setCode(languageTemplates[e.target.value])
                }}
                className="bg-dark-card border border-gray-700 rounded-lg px-4 py-2 text-white"
              >
                <option value="python">Python</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
              </select>
              <button
                onClick={handleRunCode}
                disabled={executing || completed}
                className="btn-primary flex items-center gap-2"
              >
                {executing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Run Code
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="border border-gray-700 rounded-lg overflow-hidden">
            <MonacoEditor
              height="400px"
              language={language}
              value={code}
              onChange={(value) => setCode(value || '')}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </div>
        </div>

        {/* Hints */}
        {assignment.hints && assignment.hints.length > 0 && (
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-neon-yellow" />
                Hints
              </h2>
              <button
                onClick={() => {
                  if (!showHints) {
                    setShowHints(true)
                    setCurrentHintIndex(0)
                  } else if (currentHintIndex < assignment.hints.length - 1) {
                    setCurrentHintIndex(currentHintIndex + 1)
                  }
                }}
                className="btn-secondary text-sm"
                disabled={showHints && currentHintIndex >= assignment.hints.length - 1}
              >
                {!showHints
                  ? 'Show Hint'
                  : currentHintIndex < assignment.hints.length - 1
                  ? 'Next Hint'
                  : 'All Hints Shown'}
              </button>
            </div>
            {showHints && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentHintIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-neon-yellow/10 border border-neon-yellow/30 rounded-lg p-4"
                >
                  <p className="text-gray-300">
                    <span className="font-semibold text-neon-yellow">Hint {currentHintIndex + 1}:</span>{' '}
                    {assignment.hints[currentHintIndex]}
                  </p>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        )}

        {/* Test Results */}
        {testResults.length > 0 && (
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold mb-4">Test Results</h2>
            <div className="space-y-3">
              {testResults.map((result, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-lg border ${
                    result.passed
                      ? 'bg-green-500/10 border-green-500/30'
                      : 'bg-red-500/10 border-red-500/30'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    {result.passed ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-400" />
                    )}
                    <span className="font-semibold">
                      Test Case {idx + 1}: {result.passed ? 'Passed' : 'Failed'}
                    </span>
                  </div>
                  {assignment.testCases?.[idx] && (
                    <p className="text-sm text-gray-400 mb-2">
                      {assignment.testCases[idx].description}
                    </p>
                  )}
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400 mb-1">Input</p>
                      <p className="text-white font-mono">{result.input}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 mb-1">Expected</p>
                      <p className="text-white font-mono">{result.expected}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 mb-1">Got</p>
                      <p className="text-white font-mono">{result.got}</p>
                    </div>
                  </div>
                  {result.error && (
                    <div className="mt-2 p-2 bg-red-500/20 rounded text-sm text-red-300 font-mono">
                      {result.error}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completion Message */}
        {completed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-6 bg-gradient-to-r from-neon-green/20 to-neon-cyan/20 border-2 border-neon-green"
          >
            <div className="text-center">
              <CheckCircle2 className="w-16 h-16 text-neon-green mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Assignment Completed! 🎉</h2>
              <p className="text-gray-300">Great job! You've mastered this personalized challenge!</p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

