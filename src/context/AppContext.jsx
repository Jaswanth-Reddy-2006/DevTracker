import { createContext, useState, useEffect, useCallback, useRef } from 'react'
import * as actions from './actions'
import { useLocalStorage } from '../hooks/useLocalStorage'

const AppContext = createContext()

const STORAGE_KEY = 'devtracker-state'

const initialState = {
  tasks: [],
  groups: [],
  activities: [],
  insights: [],
  developerScore: 742,
  focusRatio: 87,
  theme: 'dark',
}

export function AppContextProvider({ children }) {
  const { loadState, saveState } = useLocalStorage()
  const [state, setState] = useState(() => loadState(STORAGE_KEY, initialState))
  const isInitialMount = useRef(true)

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
    saveState(STORAGE_KEY, state)
  }, [state, saveState])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme)
  }, [state.theme])

  const setTheme = useCallback((theme) => {
    setState((prevState) => actions.setThemeAction(prevState, theme))
  }, [])

  const toggleTheme = useCallback(() => {
    setState((prevState) => actions.toggleThemeAction(prevState))
  }, [])

  const addTask = useCallback((task) => {
    setState((prevState) => actions.addTaskAction(prevState, task))
  }, [])

  const updateTask = useCallback((id, updates) => {
    setState((prevState) => actions.updateTaskAction(prevState, id, updates))
  }, [])

  const deleteTask = useCallback((id) => {
    setState((prevState) => actions.deleteTaskAction(prevState, id))
  }, [])

  const completeTask = useCallback((id) => {
    setState((prevState) => actions.completeTaskAction(prevState, id))
  }, [])

  const addGroup = useCallback((group) => {
    setState((prevState) => actions.addGroupAction(prevState, group))
  }, [])

  const updateGroup = useCallback((id, updates) => {
    setState((prevState) => actions.updateGroupAction(prevState, id, updates))
  }, [])

  const deleteGroup = useCallback((id) => {
    setState((prevState) => actions.deleteGroupAction(prevState, id))
  }, [])

  const addGroupMember = useCallback((groupId, member) => {
    setState((prevState) => actions.addGroupMemberAction(prevState, groupId, member))
  }, [])

  const removeGroupMember = useCallback((groupId, memberId) => {
    setState((prevState) => actions.removeGroupMemberAction(prevState, groupId, memberId))
  }, [])

  const incrementScore = useCallback((amount) => {
    setState((prevState) => actions.incrementScoreAction(prevState, amount))
  }, [])

  const updateFocusRatio = useCallback((ratio) => {
    setState((prevState) => actions.updateFocusRatioAction(prevState, ratio))
  }, [])

  const addActivity = useCallback((activity) => {
    setState((prevState) => actions.addActivityAction(prevState, activity))
  }, [])

  const updateInsights = useCallback((insights) => {
    setState((prevState) => actions.updateInsightsAction(prevState, insights))
  }, [])

  const value = {
    ...state,
    setTheme,
    toggleTheme,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    addGroup,
    updateGroup,
    deleteGroup,
    addGroupMember,
    removeGroupMember,
    incrementScore,
    updateFocusRatio,
    addActivity,
    updateInsights,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export default AppContext
