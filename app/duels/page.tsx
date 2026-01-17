'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sword, Users, Clock, Trophy, Zap } from 'lucide-react'
import { Duel } from '@/lib/types/contests'

export default function DuelsPage() {
  const [duels, setDuels] = useState<Duel[]>([])
  const [activeTab, setActiveTab] = useState<'find' | 'active' | 'history'>('find')

  const handleFindRandom = () => {
    // Find random opponent logic
    alert('Finding random opponent...')
  }

  const handleCreateDuel = () => {
    // Create duel logic
    alert('Create duel feature coming soon!')
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-5xl font-bold neon-text mb-4 flex items-center gap-3">
            <Sword className="w-12 h-12 text-neon-cyan" />
            1v1 Duels
          </h1>
          <p className="text-xl text-gray-400">Challenge other coders in head-to-head battles!</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('find')}
            className={`px-6 py-2 rounded-lg font-bold transition-all ${
              activeTab === 'find'
                ? 'bg-neon-cyan text-white'
                : 'bg-dark-card text-gray-400 hover:bg-dark-card/80'
            }`}
          >
            Find Opponent
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`px-6 py-2 rounded-lg font-bold transition-all ${
              activeTab === 'active'
                ? 'bg-neon-cyan text-white'
                : 'bg-dark-card text-gray-400 hover:bg-dark-card/80'
            }`}
          >
            Active Duels
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-2 rounded-lg font-bold transition-all ${
              activeTab === 'history'
                ? 'bg-neon-cyan text-white'
                : 'bg-dark-card text-gray-400 hover:bg-dark-card/80'
            }`}
          >
            History
          </button>
        </div>

        {/* Content */}
        {activeTab === 'find' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 text-center"
          >
            <Sword className="w-24 h-24 text-neon-cyan mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Ready for a Challenge?</h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Test your skills against other coders! Solve the same problem faster than your opponent to win.
            </p>
            <div className="flex gap-4 justify-center">
              <button onClick={handleFindRandom} className="btn-primary text-lg px-8 py-4">
                <Zap className="w-5 h-5 inline mr-2" />
                Find Random Opponent
              </button>
              <button onClick={handleCreateDuel} className="btn-secondary text-lg px-8 py-4">
                <Users className="w-5 h-5 inline mr-2" />
                Challenge Friend
              </button>
            </div>
          </motion.div>
        )}

        {activeTab === 'active' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {duels.length === 0 ? (
              <div className="glass-card p-8 text-center">
                <Clock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No active duels</p>
              </div>
            ) : (
              duels.map((duel) => (
                <div key={duel.id} className="glass-card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-2">vs {duel.opponentName}</h3>
                      <p className="text-gray-400">{duel.problem.title}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-neon-cyan font-bold">{duel.xpReward} XP</div>
                      <div className="text-sm text-gray-400">Reward</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="glass-card p-8 text-center">
              <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No duel history yet</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}


