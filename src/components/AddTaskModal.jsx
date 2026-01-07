import { useState } from 'react'
import Modal from './ui/Modal'

export default function AddTaskModal({ onClose, onAdd, taskToEdit }) {
  const isEdit = !!taskToEdit
  const [formData, setFormData] = useState({
    name: taskToEdit?.name || '',
    activityType: taskToEdit?.activityType || 'Coding',
    targetDuration: taskToEdit?.targetDuration || 60,
    duration: taskToEdit?.duration || 1,
    difficulty: taskToEdit?.difficulty || 'Medium',
    priority: taskToEdit?.priority || 'Medium',
    tags: taskToEdit?.tags?.join(', ') || '',
    subtasks: taskToEdit?.subtasks || [],
  })

  const [newSubtask, setNewSubtask] = useState('')

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      setFormData(prev => ({
        ...prev,
        subtasks: [...prev.subtasks, { id: Date.now().toString(), text: newSubtask.trim(), completed: false }]
      }))
      setNewSubtask('')
    }
  }

  const removeSubtask = (id) => {
    setFormData(prev => ({
      ...prev,
      subtasks: prev.subtasks.filter(st => st.id !== id)
    }))
  }

  const activityTypes = ['Coding', 'Reading', 'Video', 'Design', 'Writing', 'Testing']
  const difficulties = ['Easy', 'Medium', 'Hard']
  const priorities = ['Low', 'Medium', 'High']

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: (name === 'targetDuration' || name === 'duration') ? parseInt(value) : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.name.trim() === '') return

    const processedData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
    }

    if (isEdit) {
      onAdd({ ...taskToEdit, ...processedData })
    } else {
      onAdd(processedData)
    }

    onClose()
  }

  return (
    <Modal onClose={onClose} title={isEdit ? 'RECONFIG_PROTOCOL' : 'INITIALIZE_OBJECTIVE'}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: 'var(--text-tertiary)' }}>
              Objective_Designation
            </label>
            <span className="text-[9px] font-black uppercase text-blue-500">Required_Field</span>
          </div>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., ARCH_NEURAL_INTERFACE"
            style={{ 
              backgroundColor: 'var(--bg-tertiary)', 
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)'
            }}
            className="w-full border-2 rounded-xl px-4 py-4 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all duration-300 font-bold text-sm tracking-tight"
            autoFocus
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-2" style={{ color: 'var(--text-tertiary)' }}>
              Category_Type
            </label>
            <div className="relative">
              <select
                name="activityType"
                value={formData.activityType}
                onChange={handleChange}
                style={{ 
                  backgroundColor: 'var(--bg-tertiary)', 
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                }}
                className="w-full border-2 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all duration-300 font-black text-xs uppercase tracking-widest appearance-none cursor-pointer"
              >
                {activityTypes.map((type) => (
                  <option key={type} value={type} className="bg-slate-900 text-white">
                    {type}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-2" style={{ color: 'var(--text-tertiary)' }}>
              Priority_Rank
            </label>
            <div className="relative">
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                style={{ 
                  backgroundColor: 'var(--bg-tertiary)', 
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                }}
                className="w-full border-2 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all duration-300 font-black text-xs uppercase tracking-widest appearance-none cursor-pointer"
              >
                {priorities.map((p) => (
                  <option key={p} value={p} className="bg-slate-900 text-white">
                    {p}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-2" style={{ color: 'var(--text-tertiary)' }}>
              Target_Session (Min)
            </label>
            <input
              type="number"
              name="targetDuration"
              value={formData.targetDuration}
              onChange={handleChange}
              min="5"
              max="480"
              step="5"
              style={{ 
                backgroundColor: 'var(--bg-tertiary)', 
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)'
              }}
              className="w-full border-2 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all duration-300 font-black text-sm"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-2" style={{ color: 'var(--text-tertiary)' }}>
              Cycle_Duration (Days)
            </label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              min="1"
              max="365"
              style={{ 
                backgroundColor: 'var(--bg-tertiary)', 
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)'
              }}
              className="w-full border-2 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all duration-300 font-black text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-2" style={{ color: 'var(--text-tertiary)' }}>
            Telemetry_Tags
          </label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="e.g., REACT, NEURAL, CORE"
            style={{ 
              backgroundColor: 'var(--bg-tertiary)', 
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)'
            }}
            className="w-full border-2 rounded-xl px-4 py-3.5 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all duration-300 font-bold text-xs uppercase tracking-widest"
          />
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-2" style={{ color: 'var(--text-tertiary)' }}>
            Complexity_Architecture
          </label>
          <div className="flex gap-2">
            {difficulties.map((diff) => (
              <button
                key={diff}
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, difficulty: diff }))
                }
                className={`flex-1 py-3.5 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all duration-300 border-2 ${
                  formData.difficulty === diff
                    ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                    : 'bg-[var(--bg-tertiary)] border-[var(--border-color)] text-[var(--text-secondary)] hover:border-blue-500/50'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-2" style={{ color: 'var(--text-tertiary)' }}>
            Objective_Milestones
          </label>
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSubtask())}
                placeholder="Initialize sub-protocol..."
                style={{ 
                  backgroundColor: 'var(--bg-tertiary)', 
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                }}
                className="flex-1 border-2 rounded-xl px-4 py-3 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all duration-300 font-bold text-xs uppercase tracking-widest"
              />
              <button 
                type="button" 
                onClick={handleAddSubtask}
                className="px-6 rounded-xl bg-blue-600 text-white font-black hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/10"
              >
                +
              </button>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
              {formData.subtasks.map((st) => (
                <div key={st.id} className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] group hover:border-blue-500/30 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">{st.text}</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => removeSubtask(st.id)}
                    className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-500/10 rounded"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-4 rounded-2xl bg-[var(--bg-tertiary)] text-[var(--text-secondary)] font-black uppercase tracking-[0.2em] text-[10px] hover:bg-slate-200 dark:hover:bg-slate-800 transition-all border border-[var(--border-color)]"
          >
            Abort_Operation
          </button>
          <button
            type="submit"
            className="flex-1 py-4 rounded-2xl bg-blue-600 text-white font-black uppercase tracking-[0.2em] text-[10px] hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20"
          >
            {isEdit ? 'Re-Sync_Entry' : 'Establish_Objective'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
