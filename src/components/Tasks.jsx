import { useState, useEffect } from 'react'
import Card from './ui/Card'
import ProgressBar from './ui/ProgressBar'
import Button from './ui/Button'
import AddTaskModal from './AddTaskModal'
import { useAppData } from '../hooks/useAppData'
import { randomInterval } from './utils/animations'

export default function Tasks() {
  const { tasks, addTask, deleteTask, completeTask, updateTask } = useAppData()
  const [showModal, setShowModal] = useState(false)
  const [taskToEdit, setTaskToEdit] = useState(null)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('date')
  const [difficultyFilter, setDifficultyFilter] = useState('all')
  const [activityTypeFilter, setActivityTypeFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const autoCompleteInterval = setInterval(() => {
      if (!tasks) return
      tasks.forEach((task) => {
        if (task.status === 'Completed') return

        const newProgress = Math.min(
          task.progress + randomInterval(1, 4),
          100
        )
        
        if (newProgress >= 100) {
          completeTask(task.id)
        } else {
          updateTask(task.id, {
            progress: newProgress,
          })
        }
      })
    }, randomInterval(10000, 20000))

    return () => clearInterval(autoCompleteInterval)
  }, [tasks, completeTask, updateTask])

  const handleAddTask = (taskData) => {
    if (taskToEdit) {
      updateTask(taskToEdit.id, taskData)
    } else {
      addTask(taskData)
    }
    setShowModal(false)
    setTaskToEdit(null)
  }

  const handleEditTask = (task) => {
    setTaskToEdit(task)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setTaskToEdit(null)
  }

  const [selectedTags, setSelectedTags] = useState([])
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [sortOrder, setSortOrder] = useState('desc')

  const allTags = [...new Set((tasks || []).flatMap((t) => t.tags || []))]

  const filteredTasks = (tasks || [])
    .filter((task) => {
      if (filter === 'completed') return task.status === 'Completed'
      if (filter === 'active') return task.status !== 'Completed'
      return true
    })
    .filter((task) =>
      task.name.toLowerCase().includes(search.toLowerCase()) ||
      (task.tags && task.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))) ||
      task.activityType.toLowerCase().includes(search.toLowerCase())
    )
    .filter((task) =>
      difficultyFilter === 'all' ? true : task.difficulty === difficultyFilter
    )
    .filter((task) =>
      activityTypeFilter === 'all'
        ? true
        : task.activityType === activityTypeFilter
    )
    .filter((task) =>
      selectedTags.length === 0
        ? true
        : selectedTags.every((tag) => task.tags?.includes(tag))
    )
    .filter((task) => {
      if (!dateRange.start && !dateRange.end) return true
      const taskDate = new Date(task.createdAt)
      const start = dateRange.start ? new Date(dateRange.start) : new Date(0)
      const end = dateRange.end ? new Date(dateRange.end) : new Date()
      // Set end date to end of day
      end.setHours(23, 59, 59, 999)
      return taskDate >= start && taskDate <= end
    })
    .sort((a, b) => {
      let comparison = 0
      if (sortBy === 'progress') comparison = b.progress - a.progress
      else if (sortBy === 'difficulty') {
        const order = { Easy: 1, Medium: 2, Hard: 3 }
        comparison = order[a.difficulty] - order[b.difficulty]
      }
      else if (sortBy === 'name') comparison = a.name.localeCompare(b.name)
      else comparison = b.createdAt - a.createdAt
      
      return sortOrder === 'asc' ? comparison * -1 : comparison
    })

  const completedCount = (tasks || []).filter((t) => t.status === 'Completed').length
  const completionRate = (tasks || []).length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0
  const uniqueActivityTypes = [...new Set((tasks || []).map((t) => t.activityType))]
  const hasActiveFilters =
    search || 
    difficultyFilter !== 'all' || 
    activityTypeFilter !== 'all' || 
    sortBy !== 'date' || 
    selectedTags.length > 0 ||
    dateRange.start ||
    dateRange.end

  return (
    <div className="min-h-screen p-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div className="animate-slideUp">
            <h1 className="text-4xl font-black mb-2 tracking-tight" style={{ color: 'var(--text-primary)' }}>Tasks</h1>
            <p className="font-medium" style={{ color: 'var(--text-secondary)' }}>
              <span className="text-blue-500 font-bold">{completedCount}</span>/{tasks.length} tasks completed • <span className="text-purple-500 font-bold">{completionRate}%</span> overall progress
            </p>
          </div>
          <Button
            onClick={() => setShowModal(true)}
            variant="primary"
            className="animate-slideUp shadow-xl"
          >
            <span className="text-xl">+</span> Add New Task
          </Button>
        </div>

        <div className="space-y-6 mb-10 animate-fadeIn">
          <div className="flex gap-2 flex-wrap items-center">
            {['all', 'active', 'completed'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2 rounded-xl font-bold transition-all duration-300 ${
                  filter === f
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-105'
                    : 'hover:bg-blue-500/10'
                }`}
                style={filter !== f ? { backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' } : {}}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex gap-3 flex-wrap items-center">
            <div className="relative flex-1 min-w-64">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
              <input
                type="text"
                placeholder="Search tasks, tags, or activity type..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ 
                  backgroundColor: 'var(--bg-tertiary)', 
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                }}
                className="w-full border rounded-2xl pl-12 pr-4 py-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all duration-300"
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
            {hasActiveFilters && (
              <button
                onClick={() => {
                  setSearch('')
                  setDifficultyFilter('all')
                  setActivityTypeFilter('all')
                  setSortBy('date')
                  setSortOrder('desc')
                  setSelectedTags([])
                  setDateRange({ start: '', end: '' })
                }}
                className="px-5 py-3 rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500/20 font-bold transition-all duration-300 border border-red-500/20"
              >
                Reset
              </button>
            )}
          </div>

          {showFilters && (
            <Card animated padding={true} className="border-2 border-blue-500/20 shadow-2xl">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest mb-3" style={{ color: 'var(--text-tertiary)' }}>
                    Sort Options
                  </label>
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-1 bg-[var(--bg-tertiary)] p-1 rounded-xl border border-[var(--border-color)]">
                      {['date', 'progress', 'difficulty', 'name'].map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setSortBy(opt)}
                          className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            sortBy === opt
                              ? 'bg-blue-600 text-white shadow-md'
                              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                          }`}
                        >
                          {opt.charAt(0).toUpperCase().slice(0, 1)}
                        </button>
                      ))}
                    </div>
                    <button 
                      onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                      className="text-[10px] font-bold flex items-center justify-center gap-2 py-2 rounded-xl border border-[var(--border-color)] hover:bg-[var(--bg-secondary)] transition-colors"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {sortOrder === 'desc' ? '⬇️ Desc' : '⬆️ Asc'}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest mb-3" style={{ color: 'var(--text-tertiary)' }}>
                    Difficulty & Type
                  </label>
                  <div className="space-y-3">
                    <select 
                      value={difficultyFilter} 
                      onChange={(e) => setDifficultyFilter(e.target.value)}
                      className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-xl px-3 py-2 text-xs font-bold focus:outline-none"
                    >
                      <option value="all">All Difficulties</option>
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                    <select 
                      value={activityTypeFilter} 
                      onChange={(e) => setActivityTypeFilter(e.target.value)}
                      className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-xl px-3 py-2 text-xs font-bold focus:outline-none"
                    >
                      <option value="all">All Activities</option>
                      {uniqueActivityTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest mb-3" style={{ color: 'var(--text-tertiary)' }}>
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-2">
                    {allTags.length > 0 ? (
                      allTags.map(tag => (
                        <button
                          key={tag}
                          onClick={() => setSelectedTags(prev => 
                            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
                          )}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                            selectedTags.includes(tag)
                              ? 'bg-blue-600 border-blue-500 text-white'
                              : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:border-blue-500/50'
                          }`}
                        >
                          #{tag}
                        </button>
                      ))
                    ) : (
                      <span className="text-[10px] italic text-[var(--text-tertiary)]">No tags available</span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest mb-3" style={{ color: 'var(--text-tertiary)' }}>
                    Timeline
                  </label>
                  <div className="space-y-2">
                    <input 
                      type="date" 
                      value={dateRange.start}
                      onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                      className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-xl px-3 py-1.5 text-[10px] font-bold focus:outline-none"
                    />
                    <input 
                      type="date" 
                      value={dateRange.end}
                      onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                      className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-xl px-3 py-1.5 text-[10px] font-bold focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-4 animate-fadeIn">
          {filteredTasks.length === 0 ? (
            <Card padding={false}>
              <div className="text-center py-20 bg-gradient-to-b from-transparent to-blue-500/5 rounded-2xl">
                <div className="text-5xl mb-4">🔍</div>
                <p className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>No tasks found</p>
                <p style={{ color: 'var(--text-tertiary)' }}>
                  {hasActiveFilters 
                    ? 'Try adjusting your filters or search query'
                    : 'Get started by creating your first task!'}
                </p>
              </div>
            </Card>
          ) : (
            filteredTasks.map((task) => (
              <Card key={task.id} hover animated className="group">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-bold tracking-tight group-hover:text-blue-500 transition-colors" style={{ color: 'var(--text-primary)' }}>{task.name}</h3>
                      <div className="flex gap-2">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-md font-black uppercase tracking-wider ${
                            task.difficulty === 'Easy'
                              ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                              : task.difficulty === 'Medium'
                              ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                              : 'bg-red-500/10 text-red-500 border border-red-500/20'
                          }`}
                        >
                          {task.difficulty}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-md font-black uppercase tracking-wider ${
                            task.priority === 'High'
                              ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20'
                              : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                          }`}
                        >
                          {task.priority}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 mb-4 text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-tertiary)' }}>
                      <span className="flex items-center gap-1.5">
                        <span className="text-sm">📋</span> {task.activityType}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="text-sm">⏱️</span> {task.targetDuration}m
                      </span>
                    </div>

                    {task.tags && task.tags.length > 0 && (
                      <div className="flex gap-2 flex-wrap mb-4">
                        {task.tags.map(tag => (
                          <span key={tag} className="text-[10px] font-bold px-2 py-1 rounded-lg border transition-colors hover:border-blue-500/50" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)', borderColor: 'var(--border-color)' }}>
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                        <span style={{ color: 'var(--text-tertiary)' }}>Completion Progress</span>
                        <span
                          className={task.status === 'Completed' ? 'text-green-500' : 'text-blue-500'}
                        >
                          {task.progress}%
                        </span>
                      </div>
                      <ProgressBar
                        progress={task.progress}
                        color={
                          task.status === 'Completed'
                            ? 'from-green-500 to-emerald-400'
                            : 'from-blue-600 to-indigo-500'
                        }
                        showLabel={false}
                        className="h-2.5 shadow-inner"
                      />
                    </div>
                  </div>

                  <div className="flex md:flex-col gap-2 justify-end">
                    {task.status !== 'Completed' && (
                      <button
                        onClick={() => completeTask(task.id)}
                        className="px-4 py-2 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 border border-green-500/20"
                      >
                        Verify
                      </button>
                    )}
                    <button
                      onClick={() => handleEditTask(task)}
                      className="px-4 py-2 bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 border border-blue-500/20"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 border border-red-500/20"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {showModal && (
        <AddTaskModal
          onClose={handleCloseModal}
          onAdd={handleAddTask}
          taskToEdit={taskToEdit}
        />
      )}
    </div>
  )
}
