'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { SUBJECTS, type Subject } from '@/lib/subjects'
import { Lock, CheckCircle2, Sparkles } from 'lucide-react'

export default function JourneyMap() {
  const router = useRouter()

  const handleSubjectClick = (subjectId: Subject) => {
    router.push(`/subject/${subjectId}`)
  }

  return (
    <div className="space-y-8">
      <h2 className="text-4xl font-bold text-center neon-text mb-8">
        Choose Your Learning Path
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(Object.keys(SUBJECTS) as Subject[]).map((subjectId) => {
          const subject = SUBJECTS[subjectId]
          return (
            <motion.div
              key={subjectId}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="glass-card p-6 cursor-pointer relative overflow-hidden group"
              onClick={() => handleSubjectClick(subjectId)}
            >
              {/* Background glow effect */}
              <div className={`absolute inset-0 bg-gradient-to-br from-${subject.color}/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
              
              <div className="relative z-10">
                <div className="text-6xl mb-4">{subject.icon}</div>
                <h3 className="text-2xl font-bold mb-2 text-neon-cyan">{subject.name}</h3>
                <p className="text-gray-400 mb-4">
                  {subject.units.length} units to master
                </p>

                {/* Progress indicator */}
                <div className="space-y-2">
                  {subject.units.slice(0, 3).map((unit, idx) => (
                    <div key={unit.id} className="flex items-center gap-2 text-sm">
                      {unit.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-neon-green" />
                      ) : unit.locked ? (
                        <Lock className="w-4 h-4 text-gray-600" />
                      ) : (
                        <Sparkles className="w-4 h-4 text-neon-cyan animate-pulse" />
                      )}
                      <span className={unit.completed ? 'text-neon-green' : unit.locked ? 'text-gray-600' : 'text-white'}>
                        {unit.name}
                      </span>
                    </div>
                  ))}
                  {subject.units.length > 3 && (
                    <div className="text-xs text-gray-500">
                      +{subject.units.length - 3} more units
                    </div>
                  )}
                </div>

                {/* XP indicator */}
                <div className="mt-4 pt-4 border-t border-neon-cyan/20">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Total XP</span>
                    <span className="text-neon-cyan font-bold">
                      {subject.units.reduce((sum, u) => sum + u.xpReward, 0)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

