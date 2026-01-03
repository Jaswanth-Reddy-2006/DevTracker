import { useState, useEffect } from 'react'
import Card from './ui/Card'
import ProgressBar from './ui/ProgressBar'
import { useAppData } from '../hooks/useAppData'

export default function Groups() {
  const { groups, addGroup } = useAppData()
  const [selectedGroupId, setSelectedGroupId] = useState(null)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('score')
  const [onlineFilter, setOnlineFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  // Initialize with a default group if none exists
  useEffect(() => {
    if (groups && groups.length === 0) {
      addGroup({
        name: 'Global Developers',
        description: 'Default group for all developers',
        members: [
          { name: 'Alex Chen', taskCompletionPercentage: 85, developerScore: 842, isOnline: true },
          { name: 'Jordan Smith', taskCompletionPercentage: 72, developerScore: 761, isOnline: true },
          { name: 'Sam Patel', taskCompletionPercentage: 68, developerScore: 698, isOnline: false },
          { name: 'Casey Williams', taskCompletionPercentage: 91, developerScore: 923, isOnline: true },
          { name: 'Morgan Lee', taskCompletionPercentage: 55, developerScore: 612, isOnline: true },
        ],
        isActive: true
      })
    }
  }, [groups, addGroup])

  useEffect(() => {
    if (groups && groups.length > 0 && !selectedGroupId) {
      setSelectedGroupId(groups[0].id)
    }
  }, [groups, selectedGroupId])

  const selectedGroup = groups?.find(g => g.id === selectedGroupId)
  const members = selectedGroup?.members || []

  const filteredMembers = members
    .filter((member) =>
      member.name.toLowerCase().includes(search.toLowerCase())
    )
    .filter((member) => {
      if (onlineFilter === 'online') return member.isOnline
      if (onlineFilter === 'offline') return !member.isOnline
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'completion')
        return b.taskCompletionPercentage - a.taskCompletionPercentage
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      return b.developerScore - a.developerScore
    })

  const sortedMembers = [...filteredMembers]

  const currentUserScore = 742 // This should ideally come from AppContext as well
  const averageScore =
    Math.round(
      filteredMembers.reduce((sum, m) => sum + m.developerScore, 0) /
        (filteredMembers.length || 1)
    ) || 0
  const topScore = sortedMembers[0]?.developerScore || 0
  const hasActiveFilters = search || onlineFilter !== 'all' || sortBy !== 'score'
  const onlineCount = members.filter((m) => m.isOnline).length

  return (
    <div className="min-h-screen p-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 flex justify-between items-end animate-slideUp">
          <div>
            <h1 className="text-4xl font-black mb-2 tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Groups
            </h1>
            <p className="font-medium" style={{ color: 'var(--text-secondary)' }}>
              <span className="text-green-500 font-bold">{onlineCount}</span> developers online now • Verified accountability
            </p>
          </div>
          
          {groups && groups.length > 1 && (
            <div className="flex gap-2">
              <select
                value={selectedGroupId}
                onChange={(e) => setSelectedGroupId(e.target.value)}
                style={{ 
                  backgroundColor: 'var(--bg-tertiary)', 
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                }}
                className="border-2 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all duration-200 font-bold"
              >
                {groups.map(group => (
                  <option key={group.id} value={group.id} className="bg-gray-900">
                    {group.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="space-y-4 mb-10 animate-fadeIn">
          <div className="flex gap-3 flex-wrap items-center">
            <div className="relative flex-1 min-w-64">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
              <input
                type="text"
                placeholder="Find a teammate..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ 
                  backgroundColor: 'var(--bg-tertiary)', 
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                }}
                className="w-full border rounded-2xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all duration-300"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-5 py-3 rounded-2xl font-bold transition-all duration-300 border flex items-center gap-2 ${
                showFilters || hasActiveFilters
                  ? 'bg-blue-600/20 text-blue-400 border-blue-500/50 shadow-inner'
                  : 'hover:bg-blue-500/5 hover:border-blue-500/30'
              }`}
              style={!(showFilters || hasActiveFilters) ? { backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)', color: 'var(--text-secondary)' } : {}}
            >
              <span>⚙️</span> Filters {hasActiveFilters && <span className="ml-1 w-2 h-2 bg-blue-500 rounded-full"></span>}
            </button>
          </div>

          {showFilters && (
            <Card animated padding={true} className="border-2 border-blue-500/20">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest mb-3" style={{ color: 'var(--text-tertiary)' }}>
                    Sort By
                  </label>
                  <div className="flex gap-1 bg-[var(--bg-tertiary)] p-1 rounded-xl border border-[var(--border-color)]">
                    {['score', 'completion', 'name'].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setSortBy(opt)}
                        className={`flex-1 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                          sortBy === opt
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        {opt === 'score' ? 'Score' : opt === 'completion' ? 'Tasks %' : 'Name'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest mb-3" style={{ color: 'var(--text-tertiary)' }}>
                    Status
                  </label>
                  <div className="flex gap-1 bg-[var(--bg-tertiary)] p-1 rounded-xl border border-[var(--border-color)]">
                    {['all', 'online', 'offline'].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setOnlineFilter(opt)}
                        className={`flex-1 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                          onlineFilter === opt
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        {opt.charAt(0).toUpperCase() + opt.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10 animate-fadeIn">
          <Card animated hover className="border-b-4 border-b-blue-500">
            <div className="text-center">
              <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: 'var(--text-tertiary)' }}>Your Global Rank</p>
              <p className="text-4xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                #{Math.ceil(members.length / 2)}
              </p>
              <p className="text-xs font-bold mt-2" style={{ color: 'var(--text-secondary)' }}>Score: {currentUserScore}</p>
            </div>
          </Card>

          <Card animated hover className="border-b-4 border-b-green-500">
            <div className="text-center">
              <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: 'var(--text-tertiary)' }}>Squad Average</p>
              <p className="text-4xl font-black bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                {averageScore}
              </p>
              <p className="text-xs font-bold mt-2" style={{ color: 'var(--text-secondary)' }}>{onlineCount} Online Now</p>
            </div>
          </Card>

          <Card animated hover className="border-b-4 border-b-yellow-500">
            <div className="text-center">
              <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: 'var(--text-tertiary)' }}>Top Performer</p>
              <p className="text-4xl font-black bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent truncate px-2">
                {sortedMembers[0]?.name.split(' ')[0] || 'N/A'}
              </p>
              <p className="text-xs font-bold mt-2" style={{ color: 'var(--text-secondary)' }}>Score: {topScore}</p>
            </div>
          </Card>
        </div>

        <div className="space-y-4 animate-fadeIn">
          <h2 className="text-2xl font-black mb-6 tracking-tight" style={{ color: 'var(--text-primary)' }}>Leaderboard</h2>

          {sortedMembers.map((member, index) => (
            <Card
              key={member.id}
              hover
              className={`group transition-all duration-300 ${index === 0 ? 'border-2 border-yellow-500/30 shadow-[0_0_20px_rgba(234,179,8,0.1)]' : ''}`}
            >
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex items-center gap-4 flex-1">
                  <div className={`flex items-center justify-center w-14 h-14 rounded-2xl font-black text-xl shadow-xl transform group-hover:rotate-6 transition-transform ${
                    index === 0 ? 'bg-yellow-500 text-black' : 
                    index === 1 ? 'bg-gray-300 text-black' : 
                    index === 2 ? 'bg-orange-400 text-black' : 
                    'bg-gradient-to-br from-blue-600 to-indigo-600 text-white'
                  }`}>
                    {index + 1}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                        {member.name}
                      </h3>
                      {member.isOnline && (
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                      )}
                    </div>
                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-tertiary)' }}>
                      {member.isOnline ? 'Active Session' : 'Currently Offline'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-10">
                  <div className="text-center md:text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: 'var(--text-tertiary)' }}>Dev Score</p>
                    <p className="text-2xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      {member.developerScore}
                    </p>
                  </div>

                  <div className="text-center md:text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: 'var(--text-tertiary)' }}>Tasks</p>
                    <p className="text-2xl font-black text-green-500">
                      {member.taskCompletionPercentage}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t-2 border-dashed" style={{ borderColor: 'var(--border-color)' }}>
                <ProgressBar
                  progress={member.taskCompletionPercentage}
                  color={index === 0 ? 'from-yellow-400 to-orange-500' : 'from-green-500 to-emerald-400'}
                  showLabel={false}
                  className="h-2 shadow-inner"
                />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
