'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import axios from 'axios'
import { Play, Loader2, AlertCircle, Lightbulb, Trophy, ArrowRight, RotateCcw } from 'lucide-react'
import toast from 'react-hot-toast'
import confetti from 'canvas-confetti'

// Dynamically import Monaco to avoid SSR issues
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => <div className="h-96 bg-dark-card animate-pulse rounded-lg" />,
})

interface CodingProblem {
  title: string
  description: string
  examples: Array<{
    input: string
    output: string
    explanation: string
  }>
  constraints: string[]
  hints: string[]
}

interface Hint {
  problematicLine: number
  concept: string
  explanation: string
  hint: string
  reviewConcept: string
}

interface CodingChallengeProps {
  subject: string
  unit: string
  onComplete: () => void
}

type Difficulty = 'Basic' | 'Medium' | 'Advanced'

export default function CodingChallenge({ subject, unit, onComplete }: CodingChallengeProps) {
  const [problem, setProblem] = useState<CodingProblem | null>(null)
  const [difficulty, setDifficulty] = useState<Difficulty>('Basic')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(true)
  const [executing, setExecuting] = useState(false)
  const [hint, setHint] = useState<Hint | null>(null)
  const [showHint, setShowHint] = useState(false)
  const [hintLoading, setHintLoading] = useState(false)
  const [currentHintIndex, setCurrentHintIndex] = useState(0)
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
    fetchProblem()
    setCode(languageTemplates[language])
  }, [difficulty])

  const fetchProblem = async () => {
    try {
      setLoading(true)
      const response = await axios.post('/api/gemini/coding-problem', {
        subject,
        unit,
        difficulty,
      })
      setProblem(response.data.problem)
      setCode(languageTemplates[language])
      setError(null)
      setTestResults([])
      setHint(null)
      setShowHint(false)
      setCurrentHintIndex(0)
    } catch (error) {
      console.error('Error fetching problem:', error)
      toast.error('Failed to load problem')
    } finally {
      setLoading(false)
    }
  }

  const handleRun = async () => {
    if (!code.trim()) {
      toast.error('Please write some code first')
      return
    }

    if (!problem || problem.examples.length === 0) {
      toast.error('No test cases available')
      return
    }

    setExecuting(true)
    setError(null)
    setTestResults([])

    try {
      // Execute code against all test cases
      const results = await Promise.all(
        problem.examples.map(async (ex) => {
          try {
            const response = await axios.post('/api/judge0/execute', {
              code,
              language,
              stdin: ex.input,
              expectedOutput: ex.output,
            })

            const executionResult = response.data.result

            return {
              passed: executionResult.passed,
              input: ex.input,
              expected: ex.output,
              got: executionResult.stdout || executionResult.stderr || executionResult.compileOutput || 'No output',
              status: executionResult.status,
              error: executionResult.stderr || executionResult.compileOutput || null,
            }
          } catch (err: any) {
            return {
              passed: false,
              input: ex.input,
              expected: ex.output,
              got: err.response?.data?.error || 'Execution error',
              status: 'Error',
              error: err.response?.data?.error || 'Failed to execute',
            }
          }
        })
      )

      setTestResults(results)

      const allPassed = results.every(r => r.passed)
      if (allPassed) {
        setCompleted(true)
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        })
        toast.success('All tests passed! 🎉')
      } else {
        const passedCount = results.filter(r => r.passed).length
        toast.error(`${passedCount}/${results.length} tests passed. Keep trying!`)
      }
    } catch (err: any) {
      setError(err.message || 'Execution error')
      toast.error('Code execution failed. Check your Judge0 API configuration.')
    } finally {
      setExecuting(false)
    }
  }

  const handleGetHint = async () => {
    if (!code.trim()) {
      toast.error('Write some code first')
      return
    }

    setHintLoading(true)
    try {
      const response = await axios.post('/api/gemini/hint', {
        code,
        error: error || 'Incorrect output or logic error',
        subject,
        unit,
      })
      setHint(response.data.hint)
      setShowHint(true)
    } catch (err) {
      console.error('Error fetching hint:', err)
      toast.error('Failed to get hint')
    } finally {
      setHintLoading(false)
    }
  }

  const handleNextDifficulty = () => {
    const difficulties: Difficulty[] = ['Basic', 'Medium', 'Advanced']
    const currentIdx = difficulties.indexOf(difficulty)
    if (currentIdx < difficulties.length - 1) {
      setDifficulty(difficulties[currentIdx + 1])
      setCompleted(false)
    } else {
      // All difficulties completed
      onComplete()
    }
  }

  const handleNextHint = () => {
    if (problem && currentHintIndex < problem.hints.length - 1) {
      setCurrentHintIndex(currentHintIndex + 1)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Loader2 className="w-12 h-12 text-neon-cyan" />
        </motion.div>
      </div>
    )
  }

  if (!problem) {
    return (
      <div className="glass-card p-8 text-center">
        <p className="text-red-400">Failed to load problem</p>
        <button onClick={fetchProblem} className="btn-primary mt-4">
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold neon-text mb-2">{problem.title}</h1>
          <div className="flex items-center gap-4">
            <span className={`px-4 py-1 rounded-full font-bold ${
              difficulty === 'Basic' ? 'bg-neon-green/20 text-neon-green' :
              difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-500' :
              'bg-red-500/20 text-red-500'
            }`}>
              {difficulty}
            </span>
            <span className="text-gray-400">{unit}</span>
          </div>
        </div>
        <button
          onClick={() => setDifficulty(difficulty === 'Basic' ? 'Medium' : difficulty === 'Medium' ? 'Advanced' : 'Basic')}
          className="btn-secondary"
        >
          Change Difficulty
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Problem Description */}
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h2 className="text-2xl font-bold mb-4">Problem Description</h2>
            <p className="text-gray-300 leading-relaxed whitespace-pre-line">
              {problem.description}
            </p>
          </div>

          {/* Examples */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold mb-4">Examples</h3>
            <div className="space-y-4">
              {problem.examples.map((ex, idx) => (
                <div key={idx} className="bg-dark-bg p-4 rounded-lg">
                  <div className="mb-2">
                    <span className="text-sm text-gray-400">Input:</span>
                    <pre className="text-neon-green mt-1">{ex.input}</pre>
                  </div>
                  <div className="mb-2">
                    <span className="text-sm text-gray-400">Output:</span>
                    <pre className="text-neon-cyan mt-1">{ex.output}</pre>
                  </div>
                  <div>
                    <span className="text-sm text-gray-400">Explanation:</span>
                    <p className="text-gray-300 text-sm mt-1">{ex.explanation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Constraints */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold mb-4">Constraints</h3>
            <ul className="space-y-2">
              {problem.constraints.map((constraint, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-neon-cyan">•</span>
                  <span className="text-gray-300">{constraint}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Code Editor */}
        <div className="space-y-6">
          {/* Language Selector */}
          <div className="flex items-center gap-4">
            <select
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value)
                setCode(languageTemplates[e.target.value])
              }}
              className="bg-dark-card border border-neon-cyan/50 text-white px-4 py-2 rounded-lg"
            >
              <option value="python">Python</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
            </select>
            <button
              onClick={handleGetHint}
              disabled={hintLoading}
              className="btn-secondary flex items-center gap-2"
            >
              {hintLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Lightbulb className="w-4 h-4" />
              )}
              Get AI Hint
            </button>
          </div>

          {/* Editor */}
          <div className="glass-card overflow-hidden">
            <MonacoEditor
              height="500px"
              language={language}
              value={code}
              onChange={(value) => setCode(value || '')}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 16,
                wordWrap: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </div>

          {/* AI Hint Display */}
          <AnimatePresence>
            {showHint && hint && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="glass-card p-6 border border-neon-cyan/50"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="w-6 h-6 text-neon-cyan" />
                  <h3 className="text-xl font-bold">AI Hint</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-400">Problematic Line:</span>
                    <span className="ml-2 text-neon-cyan font-bold">Line {hint.problematicLine}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-400">Concept:</span>
                    <span className="ml-2">{hint.concept}</span>
                  </div>
                  <div className="bg-dark-bg p-4 rounded-lg">
                    <p className="text-gray-300">{hint.explanation}</p>
                  </div>
                  <div className="bg-neon-cyan/10 p-4 rounded-lg border border-neon-cyan/30">
                    <p className="text-neon-cyan font-bold">💡 Hint: {hint.hint}</p>
                  </div>
                  <div className="text-sm text-gray-400">
                    Review: <span className="text-neon-purple">{hint.reviewConcept}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progressive Hints */}
          {problem.hints.length > 0 && (
            <div className="glass-card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Progressive Hints</span>
                <span className="text-xs text-gray-500">
                  {currentHintIndex + 1} / {problem.hints.length}
                </span>
              </div>
              <div className="bg-dark-bg p-3 rounded-lg mb-2">
                <p className="text-sm text-gray-300">{problem.hints[currentHintIndex]}</p>
              </div>
              {currentHintIndex < problem.hints.length - 1 && (
                <button
                  onClick={handleNextHint}
                  className="text-sm text-neon-cyan hover:underline"
                >
                  Show next hint →
                </button>
              )}
            </div>
          )}

          {/* Run Button */}
          <button
            onClick={handleRun}
            disabled={executing || !code.trim()}
            className="btn-primary w-full flex items-center justify-center gap-2 text-lg py-4 disabled:opacity-50"
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

          {/* Test Results */}
          <AnimatePresence>
            {testResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6"
              >
                <h3 className="text-xl font-bold mb-4">Test Results</h3>
                <div className="space-y-2">
                  {testResults.map((result, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg ${
                        result.passed
                          ? 'bg-neon-green/20 border border-neon-green'
                          : 'bg-red-400/20 border border-red-400'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {result.passed ? (
                          <span className="text-neon-green">✅</span>
                        ) : (
                          <span className="text-red-400">❌</span>
                        )}
                        <span className="font-bold">Test {idx + 1}</span>
                        {result.status && (
                          <span className="text-xs text-gray-400 ml-2">({result.status})</span>
                        )}
                      </div>
                      <div className="text-sm space-y-1">
                        <div>Input: <code className="text-neon-green">{result.input}</code></div>
                        <div>Expected: <code className="text-neon-cyan">{result.expected}</code></div>
                        {!result.passed && (
                          <>
                            <div>Got: <code className="text-red-400">{result.got}</code></div>
                            {result.error && (
                              <div className="mt-2 p-2 bg-red-900/20 rounded text-xs">
                                <span className="text-red-400 font-bold">Error:</span>
                                <pre className="text-red-300 mt-1 whitespace-pre-wrap">{result.error}</pre>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Completion */}
          {completed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-6 border-2 border-neon-green"
            >
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="w-8 h-8 text-neon-green" />
                <h3 className="text-2xl font-bold text-neon-green">Challenge Complete!</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Great job! You've mastered the {difficulty} level for {unit}.
              </p>
              <button
                onClick={handleNextDifficulty}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {difficulty === 'Advanced' ? 'Complete Unit' : `Try ${difficulty === 'Basic' ? 'Medium' : 'Advanced'} Level`}
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

