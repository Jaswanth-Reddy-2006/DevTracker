import { createContext, useState, useEffect, useCallback } from 'react'
import * as actions from './actions'
import { auth, db } from '../firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { collection, query, where, onSnapshot, doc } from 'firebase/firestore'
import { useNotifications } from './NotificationContext'
import axios from 'axios'
import { emitEvent } from '../utils/eventClient'

const AppContext = createContext()
export { AppContext }

const API_URL = 'http://localhost:5000/api'

// Helper to get auth header
const getAuthHeader = async () => {
  const user = auth.currentUser
  if (user) {
    const token = await user.getIdToken()
    return { headers: { Authorization: `Bearer ${token}` } }
  }
  return {}
}

const initialState = {
  user: null,
  isAuthenticated: false,
  tasks: [],
  groups: [],
  activities: [],
  insights: [],
  developerScore: 0,
  focusRatio: 0,
  theme: 'light',
  achievements: [],
  settings: {
    language: 'English',
    notifications: true,
    privacy: 'Public',
    autoTrack: true,
  }
}

export function AppContextProvider({ children }) {
  const [state, setState] = useState(initialState)
  const { addNotification } = useNotifications()

  const login = useCallback((userData) => {
    setState(prev => ({ 
      ...prev, 
      user: userData, 
      isAuthenticated: true 
    }))
    addNotification('Welcome back!', 'success')
  }, [addNotification])

  const logout = useCallback(async () => {
    await signOut(auth)
    setState(initialState)
    addNotification('Logged out successfully', 'info')
  }, [addNotification])

  const setTheme = useCallback((theme) => {
    setState((prevState) => actions.setThemeAction(prevState, theme))
  }, [])

  const toggleTheme = useCallback(() => {
    setState((prevState) => actions.toggleThemeAction(prevState))
  }, [])

  const addTask = useCallback(async (task) => {
    // Optimistic: add a local placeholder so UI shows the task immediately
    const tempId = `temp-${Date.now()}`
    const optimistic = {
      id: tempId,
      ...task,
      createdAt: Date.now(),
      status: task.status || 'In Progress',
      progress: task.progress || 0,
      userId: auth.currentUser?.uid || null,
      _unsynced: true
    }
    setState(prev => ({ ...prev, tasks: [optimistic, ...(prev.tasks || [])] }))

    try {
      const config = await getAuthHeader()
      const res = await axios.post(`${API_URL}/tasks`, task, config)
      const created = res?.data
      if (created) {
        // Replace optimistic entry with server-provided task
        setState(prev => ({ ...prev, tasks: [created, ...prev.tasks.filter(t => t.id !== tempId)] }))
      } else {
        // If server didn't return created object, mark as synced and remove _unsynced
        setState(prev => ({ ...prev, tasks: prev.tasks.map(t => t.id === tempId ? ({ ...t, _unsynced: false }) : t) }))
      }
      addNotification('Task created successfully', 'success')
    } catch (error) {
      console.error('Error adding task:', error)
      // Leave optimistic entry and mark unsynced; notify user the task is saved locally
      setState(prev => ({ ...prev, tasks: prev.tasks.map(t => t.id === tempId ? ({ ...t, _unsynced: true }) : t) }))
      addNotification('Task saved locally — sync failed', 'error')
    }
  }, [addNotification])

  const updateTask = useCallback(async (id, updates) => {
    try {
      const config = await getAuthHeader()
      await axios.put(`${API_URL}/tasks/${id}`, updates, config)
      if (updates.status === 'Completed') {
        addNotification('Task completed! +50 XP', 'success')
        try {
          emitEvent('task.completed', { taskId: id, updates })
        } catch (err) {
          console.warn('emit task.completed failed', err)
        }
      }
    } catch (error) {
      console.error('Error updating task:', error)
      addNotification('Failed to update task', 'error')
    }
  }, [addNotification])

  const addDailyProgress = useCallback(async (taskId, progress) => {
    try {
      const config = await getAuthHeader()
      await axios.post(`${API_URL}/tasks/${taskId}/progress`, { progress }, config)
      addNotification('Progress updated', 'success')
    } catch (error) {
      console.error('Error adding progress:', error)
      addNotification('Failed to update progress', 'error')
    }
  }, [addNotification])

  const verifyTask = useCallback(async (id) => {
    try {
      const config = await getAuthHeader()
      await axios.put(`${API_URL}/tasks/${id}`, { isVerified: true, status: 'Completed', progress: 100 }, config)
      addNotification('Task verified and completed!', 'success')
      try {
        emitEvent('task.completed', { taskId: id, verified: true })
      } catch (err) {
        console.warn('emit task.completed failed', err)
      }
    } catch (error) {
      console.error('Error verifying task:', error)
      addNotification('Verification failed', 'error')
    }
  }, [addNotification])

  const deleteTask = useCallback(async (id) => {
    try {
      const config = await getAuthHeader()
      await axios.delete(`${API_URL}/tasks/${id}`, config)
      addNotification('Task deleted', 'info')
    } catch (error) {
      console.error('Error deleting task:', error)
      addNotification('Failed to delete task', 'error')
    }
  }, [addNotification])

  const toggleSubtask = useCallback(async (taskId, subtaskId) => {
    const task = state.tasks.find(t => t.id === taskId)
    if (!task) return
    
    const newSubtasks = task.subtasks.map(st => 
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    )
    
    const completedCount = newSubtasks.filter(st => st.completed).length
    const progress = newSubtasks.length > 0 
      ? Math.round((completedCount / newSubtasks.length) * 100) 
      : task.progress

    await updateTask(taskId, { 
      subtasks: newSubtasks,
      progress,
      status: progress === 100 ? 'Completed' : 'In Progress'
    })
  }, [state.tasks, updateTask])

  const createGroup = useCallback(async (group) => {
    try {
      const config = await getAuthHeader()
      await axios.post(`${API_URL}/groups`, group, config)
      addNotification('Squad created successfully!', 'success')
    } catch (error) {
      console.error('Error creating group:', error)
      addNotification('Failed to create squad', 'error')
    }
  }, [addNotification])

  const joinGroup = useCallback(async (groupId, password) => {
    try {
      const config = await getAuthHeader()
      await axios.post(`${API_URL}/groups/${groupId}/join`, { password }, config)
      addNotification('Request to join squad sent!', 'success')
    } catch (error) {
      console.error('Error joining group:', error)
      addNotification('Failed to join squad', 'error')
    }
  }, [addNotification])

  const approveMember = useCallback(async (groupId, userId) => {
    try {
      const config = await getAuthHeader()
      await axios.post(`${API_URL}/groups/${groupId}/approve`, { memberId: userId }, config)
      addNotification('Member approved', 'success')
    } catch (error) {
      console.error('Error approving member:', error)
      addNotification('Failed to approve member', 'error')
    }
  }, [addNotification])

  const rejectMember = useCallback(async (groupId, userId) => {
    try {
      const config = await getAuthHeader()
      await axios.post(`${API_URL}/groups/${groupId}/reject`, { memberId: userId }, config)
      addNotification('Member request rejected', 'info')
    } catch (error) {
      console.error('Error rejecting member:', error)
    }
  }, [addNotification])

  const sendMessage = useCallback(async (groupId, message) => {
    try {
      const config = await getAuthHeader()
      await axios.post(`${API_URL}/groups/${groupId}/messages`, { text: message }, config)
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }, [])

  const exitGroup = useCallback(async (groupId) => {
    try {
      const config = await getAuthHeader()
      await axios.post(`${API_URL}/groups/${groupId}/exit`, {}, config)
      addNotification('Left squad successfully', 'info')
    } catch (error) {
      console.error('Error exiting group:', error)
    }
  }, [addNotification])

  const addGroupTask = useCallback(async (groupId, task) => {
    try {
      const config = await getAuthHeader()
      await axios.post(`${API_URL}/groups/${groupId}/tasks`, task, config)
      addNotification('Squad objective added', 'success')
    } catch (error) {
      console.error('Error adding group task:', error)
    }
  }, [addNotification])

  const updateGroupTask = useCallback(async (groupId, taskId, updates) => {
    try {
      const config = await getAuthHeader()
      await axios.put(`${API_URL}/groups/${groupId}/tasks/${taskId}`, updates, config)
    } catch (error) {
      console.error('Error updating group task:', error)
    }
  }, [])

  const updateInsights = useCallback(async (insights) => {
    try {
      const config = await getAuthHeader()
      await axios.put(`${API_URL}/users/profile`, { insights }, config)
    } catch (error) {
      console.error('Error updating insights:', error)
    }
  }, [])

  const updateSettings = useCallback(async (settings) => {
    try {
      const config = await getAuthHeader()
      await axios.put(`${API_URL}/users/settings`, settings, config)
      addNotification('Settings saved', 'success')
    } catch (error) {
      console.error('Error updating settings:', error)
      addNotification('Failed to save settings', 'error')
    }
  }, [addNotification])

  const addGroup = useCallback((group) => {
    createGroup(group)
  }, [createGroup])

  const removeGroupMember = useCallback(async (groupId, userId) => {
    try {
      const config = await getAuthHeader()
      await axios.post(`${API_URL}/groups/${groupId}/remove`, { memberId: userId }, config)
      addNotification('Member removed', 'info')
    } catch (error) {
      console.error('Error removing group member:', error)
    }
  }, [addNotification])

  const incrementScore = useCallback(async (amount) => {
    try {
      const config = await getAuthHeader()
      await axios.post(`${API_URL}/users/score`, { amount }, config)
    } catch (error) {
      console.error('Error incrementing score:', error)
    }
  }, [])

  // Listen for auth state changes and set up real-time listeners
  useEffect(() => {
    let unsubTasks = null
    let unsubGroups = null
    let unsubProfile = null

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Set initial user state
        setState(prev => ({
          ...prev,
          user: {
            id: user.uid,
            name: user.displayName || user.email.split('@')[0],
            email: user.email,
            avatar: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`
          },
          isAuthenticated: true
        }))

        // Real-time Tasks
        const qTasks = query(collection(db, "tasks"), where("userId", "==", user.uid))
        unsubTasks = onSnapshot(qTasks, (snapshot) => {
          const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
          setState(prev => ({ ...prev, tasks }))
        })

        // Real-time Groups (Squads)
        const qGroups = collection(db, "groups")
        unsubGroups = onSnapshot(qGroups, (snapshot) => {
          const groups = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
          setState(prev => ({ ...prev, groups }))
        })

        // Real-time Profile/Settings/Score
        const profileRef = doc(db, "users", user.uid)
        unsubProfile = onSnapshot(profileRef, (docSnap) => {
          if (docSnap.exists()) {
            setState(prev => ({ ...prev, ...docSnap.data() }))
          }
        })

      } else {
        if (unsubTasks) unsubTasks()
        if (unsubGroups) unsubGroups()
        if (unsubProfile) unsubProfile()
        setState(initialState)
      }
    })

    return () => {
      unsubscribeAuth()
      if (unsubTasks) unsubTasks()
      if (unsubGroups) unsubGroups()
      if (unsubProfile) unsubProfile()
    }
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme)
  }, [state.theme])

  // Achievement checking logic
  useEffect(() => {
    if (!state.isAuthenticated) return

    const syncAchievements = async () => {
      const newAchievements = []
      const currentIds = state.achievements?.map(a => a.id) || []

      // 1. Task Master: Complete 10 tasks
      const completedCount = state.tasks.filter(t => t.status === 'Completed').length
      if (completedCount >= 10 && !currentIds.includes('task_master_10')) {
        newAchievements.push({ id: 'task_master_10', title: 'Task Master', description: 'Complete 10 tasks', icon: '🏆', date: Date.now() })
      }

      // 2. High Flyer: Reach 1000 XP
      if (state.developerScore >= 1000 && !currentIds.includes('xp_1000')) {
        newAchievements.push({ id: 'xp_1000', title: 'Elite Engineer', description: 'Reach 1000 XP', icon: '💎', date: Date.now() })
      }

      // 3. Social Butterfly: Join or Create a Squad
      if (state.groups.length > 0 && !currentIds.includes('squad_member')) {
        newAchievements.push({ id: 'squad_member', title: 'Squad Goals', description: 'Be part of a squad', icon: '👥', date: Date.now() })
      }

      if (newAchievements.length > 0) {
        const updatedAchievements = [...(state.achievements || []), ...newAchievements]
        try {
          const config = await getAuthHeader()
          await axios.put(`${API_URL}/users/profile`, { achievements: updatedAchievements }, config)
          newAchievements.forEach(a => addNotification(`Achievement Unlocked: ${a.title}!`, 'success'))
        } catch (err) {
          console.error('Failed to sync achievements', err)
        }
      }
    }

    syncAchievements()
  }, [state.tasks, state.developerScore, state.groups, state.achievements, state.isAuthenticated, addNotification])

  // Auto-tracking logic centralized
  useEffect(() => {
    if (!state.isAuthenticated || !state.settings.autoTrack) return

    const interval = setInterval(() => {
      const activeTask = state.tasks.find(t => t.status === 'In Progress' && !t.isVerified)
      if (activeTask) {
        const increment = Math.floor(Math.random() * 3) + 1 // 1-3% progress
        const newProgress = Math.min((activeTask.progress || 0) + increment, 100)
        
        if (newProgress === 100) {
          verifyTask(activeTask.id)
        } else {
          updateTask(activeTask.id, { 
            progress: newProgress,
            status: 'In Progress' // Maintain status
          })
        }

        // Send a signal for this work interval
        const sendAutoSignal = async () => {
          try {
            const config = await getAuthHeader()
            await axios.post(`${API_URL}/signals`, {
              source: 'AutoTracker',
              appOrDomain: `Task: ${activeTask.title}`,
              category: 'Coding',
              startTime: new Date(Date.now() - 15000).toISOString(),
              endTime: new Date().toISOString(),
              durationInSeconds: 15
            }, config)
          } catch (err) {
            console.error('Failed to send auto-tracking signal', err)
          }
        }
        sendAutoSignal()
      }
    }, 15000) // Every 15 seconds

    return () => clearInterval(interval)
  }, [state.isAuthenticated, state.settings.autoTrack, state.tasks, updateTask, verifyTask])

  const value = {
    ...state,
    login,
    logout,
    setTheme,
    toggleTheme,
    addTask,
    updateTask,
    addDailyProgress,
    verifyTask,
    deleteTask,
    toggleSubtask,
    createGroup,
    joinGroup,
    approveMember,
    rejectMember,
    sendMessage,
    exitGroup,
    addGroupTask,
    updateGroupTask,
    updateInsights,
    updateSettings,
    addGroup,
    removeGroupMember,
    incrementScore,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export default AppContext
