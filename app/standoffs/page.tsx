'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Trophy, Clock, Zap } from 'lucide-react'
import { Standoff } from '@/lib/types/contests'

export default function StandoffsPage() {
  const [standoffs, setStandoffs] = useState<Standoff[]>([])
  const [activeTab, setActiveTab] = useState<'find' | 'active' | 'history'>('find')

  const handleFindStandoff = () => {
    // Find 3v3 standoff logic
    alert('Finding 3v3 standoff...')
  }

  const handleCreateStandoff = () => {
    // Create standoff logic
    alert('Create standoff feature coming soon!')
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
            <Users className="w-12 h-12 text-neon-purple" />
            3v3 Standoffs
          </h1>
          <p className="text-xl text-gray-400">Team up and compete in epic 3v3 battles!</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('find')}
            className={`px-6 py-2 rounded-lg font-bold transition-all ${
              activeTab === 'find'
                ? 'bg-neon-purple text-white'
                : 'bg-dark-card text-gray-400 hover:bg-dark-card/80'
            }`}
          >
            Find Match
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`px-6 py-2 rounded-lg font-bold transition-all ${
              activeTab === 'active'
                ? 'bg-neon-purple text-white'
                : 'bg-dark-card text-gray-400 hover:bg-dark-card/80'
            }`}
          >
            Active Standoffs
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-2 rounded-lg font-bold transition-all ${
              activeTab === 'history'
                ? 'bg-neon-purple text-white'
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
            <Users className="w-24 h-24 text-neon-purple mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Ready for Team Battle?</h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Form a team of 3 and compete against other teams! The team that solves the problem fastest wins!
            </p>
            <div className="flex gap-4 justify-center">
              <button onClick={handleFindStandoff} className="btn-primary text-lg px-8 py-4">
                <Zap className="w-5 h-5 inline mr-2" />
                Find Random Match
              </button>
              <button onClick={handleCreateStandoff} className="btn-secondary text-lg px-8 py-4">
                <Users className="w-5 h-5 inline mr-2" />
                Create Team
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
            {standoffs.length === 0 ? (
              <div className="glass-card p-8 text-center">
                <Clock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No active standoffs</p>
              </div>
            ) : (
              standoffs.map((standoff) => (
                <div key={standoff.id} className="glass-card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-2">Team Battle</h3>
                      <p className="text-gray-400">{standoff.problem.title}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-neon-purple font-bold">{standoff.xpReward} XP</div>
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
              <p className="text-gray-400">No standoff history yet</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}


