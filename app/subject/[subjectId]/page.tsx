'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { SUBJECTS, type Subject } from '@/lib/subjects'
import { ArrowLeft, Lock, Unlock, Trophy, Zap } from 'lucide-react'

export default function SubjectPage() {
  const params = useParams()
  const router = useRouter()
  const subjectId = params.subjectId as Subject
  const subject = SUBJECTS[subjectId]

  if (!subject) {
    return <div>Subject not found</div>
  }

  const handleUnitClick = (unitId: string) => {
    if (subject.units.find(u => u.id === unitId)?.locked) {
      return
    }
    router.push(`/subject/${subjectId}/unit/${unitId}`)
  }

  return (
    <div className="min-h-screen p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="btn-secondary mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Journey
          </button>

          <div className="text-center">
            <div className="text-6xl mb-4">{subject.icon}</div>
            <h1 className="text-5xl font-bold neon-text mb-4">{subject.name}</h1>
            <p className="text-xl text-gray-400">
              Master {subject.units.length} units to become an expert
            </p>
          </div>
        </div>

        {/* Units Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subject.units.map((unit, idx) => (
            <motion.div
              key={unit.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`glass-card p-6 cursor-pointer relative overflow-hidden ${
                unit.locked ? 'opacity-60 cursor-not-allowed' : 'hover:scale-105'
              } transition-transform`}
              onClick={() => handleUnitClick(unit.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold mb-2">{unit.name}</h3>
                  <p className="text-gray-400">{unit.description}</p>
                </div>
                {unit.locked ? (
                  <Lock className="w-8 h-8 text-gray-600" />
                ) : (
                  <Unlock className="w-8 h-8 text-neon-cyan" />
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-neon-cyan/20">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-neon-cyan" />
                  <span className="font-bold text-neon-cyan">{unit.xpReward} XP</span>
                </div>
                {unit.completed && (
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-neon-green" />
                    <span className="text-neon-green">Completed</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}


