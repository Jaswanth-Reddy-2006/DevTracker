import { useContext, useCallback } from 'react'
import { AppContext } from '../context/AppContext'

export function useAppData() {
  const context = useContext(AppContext)

  if (!context) {
    throw new Error('useAppData must be used within AppContextProvider')
  }

  const getTasks = useCallback(() => context.tasks, [context.tasks])
  const getTaskById = useCallback((id) => context.tasks.find((t) => t.id === id), [context.tasks])

  return {
    ...context,
    getTasks,
    getTaskById,
  }
}
