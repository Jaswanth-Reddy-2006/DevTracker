import { useState } from 'react'
import Modal from './ui/Modal'
import Button from './ui/Button'

export default function AddTaskModal({ onClose, onAdd, taskToEdit }) {
  const isEdit = !!taskToEdit
  const [formData, setFormData] = useState({
    name: taskToEdit?.name || '',
    activityType: taskToEdit?.activityType || 'Coding',
    targetDuration: taskToEdit?.targetDuration || 60,
    difficulty: taskToEdit?.difficulty || 'Medium',
    priority: taskToEdit?.priority || 'Medium',
    tags: taskToEdit?.tags?.join(', ') || '',
  })

  const activityTypes = ['Coding', 'Reading', 'Video', 'Design', 'Writing', 'Testing']
  const difficulties = ['Easy', 'Medium', 'Hard']
  const priorities = ['Low', 'Medium', 'High']

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'targetDuration' ? parseInt(value) : value,
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
    <Modal onClose={onClose} title={isEdit ? 'Refine Task' : 'Define New Objective'}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-black uppercase tracking-widest mb-2" style={{ color: 'var(--text-tertiary)' }}>
            Task Designation
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Implement OAuth2 flow"
            style={{ 
              backgroundColor: 'var(--bg-tertiary)', 
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)'
            }}
            className="w-full border-2 rounded-xl px-4 py-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all duration-300 font-medium"
            autoFocus
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-widest mb-2" style={{ color: 'var(--text-tertiary)' }}>
              Category
            </label>
            <select
              name="activityType"
              value={formData.activityType}
              onChange={handleChange}
              style={{ 
                backgroundColor: 'var(--bg-tertiary)', 
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)'
              }}
              className="w-full border-2 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all duration-300 font-bold"
            >
              {activityTypes.map((type) => (
                <option key={type} value={type} className="bg-gray-900">
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-widest mb-2" style={{ color: 'var(--text-tertiary)' }}>
              Priority Rank
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              style={{ 
                backgroundColor: 'var(--bg-tertiary)', 
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)'
              }}
              className="w-full border-2 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all duration-300 font-bold"
            >
              {priorities.map((p) => (
                <option key={p} value={p} className="bg-gray-900">
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-black uppercase tracking-widest mb-2" style={{ color: 'var(--text-tertiary)' }}>
            Allocated Time (minutes)
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
            className="w-full border-2 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all duration-300 font-bold"
          />
        </div>

        <div>
          <label className="block text-xs font-black uppercase tracking-widest mb-2" style={{ color: 'var(--text-tertiary)' }}>
            Keywords / Tags
          </label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="react, api, critical..."
            style={{ 
              backgroundColor: 'var(--bg-tertiary)', 
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)'
            }}
            className="w-full border-2 rounded-xl px-4 py-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all duration-300 font-medium"
          />
        </div>

        <div>
          <label className="block text-xs font-black uppercase tracking-widest mb-2" style={{ color: 'var(--text-tertiary)' }}>
            Complexity Level
          </label>
          <div className="flex gap-2">
            {difficulties.map((diff) => (
              <button
                key={diff}
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, difficulty: diff }))
                }
                className={`flex-1 py-3 rounded-xl font-black uppercase tracking-wider text-xs transition-all duration-300 border-2 ${
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

        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            onClick={onClose}
            variant="secondary"
            className="flex-1 py-4"
          >
            Abort
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="flex-1 py-4"
          >
            {isEdit ? 'Update Entry' : 'Confirm Objective'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
