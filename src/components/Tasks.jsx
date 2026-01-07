import { useState } from 'react'
import Card from './ui/Card'
import ProgressBar from './ui/ProgressBar'
import Button from './ui/Button'
import AddTaskModal from './AddTaskModal'
import { useAppData } from '../hooks/useAppData'

export default function Tasks() {
  const { 
    tasks, addTask, deleteTask, updateTask, verifyTask 
  } = useAppData()
  
  const [showModal, setShowModal] = useState(false)
  const [taskToEdit, setTaskToEdit] = useState(null)
  const [expandedTask, setExpandedTask] = useState(null)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [showFilters, setShowFilters] = useState(false)

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
    .sort((a, b) => b.createdAt - a.createdAt)

  const completedCount = (tasks || []).filter((t) => t.status === 'Completed').length
  const completionRate = (tasks || []).length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0
  const hasActiveFilters = search || filter !== 'all'

  return (
    <div className="space-y-10 py-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="animate-slideUp">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2.5 h-8 bg-gradient-to-b from-blue-600 to-indigo-700 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.4)]"></div>
            <div>
              <h1 className="text-4xl font-black tracking-tighter uppercase leading-none" style={{ color: 'var(--text-primary)' }}>
                PROTOCOL_QUEUE
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[8px] font-black text-blue-500 uppercase tracking-[0.4em]">Queue_Active</span>
                <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] mt-3" style={{ color: 'var(--text-tertiary)' }}>
            <span className="text-blue-500">{completedCount}</span>/{tasks.length} SYNCED • <span className="text-indigo-500">{completionRate}%</span> ACCURACY_INDEX
          </p>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          variant="primary"
          className="animate-slideUp shadow-xl px-10 py-4 text-[10px] uppercase tracking-[0.2em]"
        >
          Initialize_Protocol
        </Button>
      </header>

      <div className="space-y-8 animate-fadeIn">
        <div className="flex flex-col lg:flex-row gap-6 items-stretch lg:items-center">
          <div className="flex gap-2 p-1.5 bg-[var(--bg-secondary)] rounded-[var(--radius-xl)] border border-[var(--border-color)] shadow-inner">
            {['all', 'active', 'completed'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-8 py-2.5 rounded-[var(--radius-lg)] text-xs font-black uppercase tracking-widest transition-all duration-500 ${
                  filter === f
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'text-[var(--text-secondary)] hover:text-blue-500'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex-1 flex gap-4">
            <div className="relative flex-1 group">
              <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-tertiary)] group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input
                type="text"
                placeholder="Search protocols, hashes, or tags..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[var(--bg-secondary)] border-2 border-[var(--border-color)] rounded-[var(--radius-xl)] pl-14 pr-6 py-4 text-sm font-bold placeholder-[var(--text-tertiary)] focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-4 rounded-[var(--radius-xl)] border-2 transition-all duration-300 ${
                showFilters || hasActiveFilters
                  ? 'bg-blue-500 border-blue-500 text-white shadow-lg'
                  : 'bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-secondary)] hover:border-blue-500/50'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
            </button>
          </div>
        </div>

        <div className="grid gap-6">
          {filteredTasks.length === 0 ? (
            <Card glass padding={false} className="border-dashed border-2">
              <div className="text-center py-32 bg-gradient-to-b from-transparent to-blue-500/5 rounded-[var(--radius-xl)]">
                <div className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-blue-500/20">
                  <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <p className="text-2xl font-black uppercase tracking-tight mb-2" style={{ color: 'var(--text-primary)' }}>Protocol Not Found</p>
                <p className="text-[var(--text-tertiary)] font-bold text-sm uppercase tracking-widest">Awaiting System Input</p>
              </div>
            </Card>
          ) : (
            filteredTasks.map((task) => (
              <Card key={task.id} glass hover animated className="group relative overflow-hidden border border-[var(--border-color)]">
                <div className={`absolute left-0 top-0 bottom-0 w-1 transition-all duration-500 group-hover:w-2 ${
                  task.status === 'Completed' ? 'bg-green-500' : 
                  task.difficulty === 'Hard' ? 'bg-red-500' : 
                  task.difficulty === 'Medium' ? 'bg-yellow-500' : 'bg-blue-500'
                }`}></div>
                <div className="flex flex-col md:flex-row md:items-center gap-8 py-2">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-4">
                        <div className="text-[10px] font-mono text-blue-500/50">#{task.id?.substring(0, 8).toUpperCase()}</div>
                        <h3 
                          className="text-2xl font-black uppercase tracking-tight group-hover:text-blue-500 transition-colors cursor-pointer" 
                          style={{ color: 'var(--text-primary)' }}
                          onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
                        >
                          {task.name}
                        </h3>
                      </div>
                      <div className="flex gap-2">
                        <span className={`text-[8px] px-2 py-1 rounded border font-black uppercase tracking-widest ${
                          task.difficulty === 'Hard' ? 'bg-red-500/10 text-red-600 border-red-500/20' : 
                          task.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' : 
                          'bg-green-500/10 text-green-600 border-green-500/20'
                        }`}>
                          Diff: {task.difficulty}
                        </span>
                        <span className="text-[8px] px-2 py-1 rounded bg-blue-500/10 text-blue-600 border border-blue-500/20 font-black uppercase tracking-widest">
                          Type: {task.activityType}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {task.tags?.map(tag => (
                        <span key={tag} className="text-[10px] font-black uppercase text-[var(--text-tertiary)] bg-[var(--bg-tertiary)] px-3 py-1 rounded-lg">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-end">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)]">Sync Progress</span>
                        <span className="text-sm font-black text-blue-500">{task.progress}%</span>
                      </div>
                      <ProgressBar 
                        progress={task.progress} 
                        color={task.status === 'Completed' ? 'from-green-500 to-emerald-500' : 'from-blue-500 to-indigo-600'} 
                        showLabel={false}
                        className="h-3 rounded-full"
                      />
                    </div>
                  </div>

                  <div className="flex md:flex-col gap-3 min-w-[160px]">
                    {task.status !== 'Completed' ? (
                      <Button 
                        onClick={() => verifyTask(task.id)}
                        variant="primary" 
                        className="w-full py-3 text-[10px] uppercase tracking-[0.2em]"
                      >
                        Verify Protocol
                      </Button>
                    ) : (
                      <div className="w-full py-3 rounded-[var(--radius-lg)] bg-green-500/10 border border-green-500/20 flex items-center justify-center gap-2">
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                        <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Verified</span>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditTask(task)}
                        className="flex-1 p-3 rounded-[var(--radius-lg)] bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-blue-500 hover:border-blue-500/50 transition-all"
                      >
                        <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5M16.242 19.142l4.95-4.95-1.414-1.414-4.95 4.95 1.414 1.414z" /></svg>
                      </button>
                      <button 
                        onClick={() => deleteTask(task.id)}
                        className="flex-1 p-3 rounded-[var(--radius-lg)] bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-red-500 hover:border-red-500/50 transition-all"
                      >
                        <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {showModal && (
        <AddTaskModal
          isOpen={showModal}
          onClose={handleCloseModal}
          onAdd={handleAddTask}
          taskToEdit={taskToEdit}
        />
      )}
    </div>
  )
}
