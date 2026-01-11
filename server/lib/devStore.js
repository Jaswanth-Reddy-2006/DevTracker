// Simple in-memory dev store for tasks (per-user)
const store = new Map(); // userId -> [{...task}]

function _ensure(userId) {
  if (!store.has(userId)) store.set(userId, [])
  return store.get(userId)
}

export function getTasks(userId) {
  return Promise.resolve([..._ensure(userId)])
}

export function addTask(userId, task) {
  const tasks = _ensure(userId)
  const id = Date.now().toString()
  const t = { id, ...task }
  tasks.unshift(t)
  return Promise.resolve(t)
}

export function updateTask(userId, id, updates) {
  const tasks = _ensure(userId)
  const idx = tasks.findIndex(t => t.id === id)
  if (idx === -1) return Promise.reject(new Error('Not found'))
  tasks[idx] = { ...tasks[idx], ...updates }
  return Promise.resolve(tasks[idx])
}

export function deleteTask(userId, id) {
  const tasks = _ensure(userId)
  const idx = tasks.findIndex(t => t.id === id)
  if (idx === -1) return Promise.reject(new Error('Not found'))
  tasks.splice(idx,1)
  return Promise.resolve()
}

export default { getTasks, addTask, updateTask, deleteTask }
