export const addTaskAction = (state, task) => {
  const newTask = {
    ...task,
    id: Date.now().toString(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
    completedAt: null,
    priority: task.priority || 'Medium',
    tags: task.tags || [],
    subtasks: task.subtasks || [],
    progress: 0,
    dailyProgress: [], // Array of { date: string, progress: number }
    duration: task.duration || 1, // in days
    isVerified: false,
    status: 'Pending Verification',
  }
  return {
    ...state,
    tasks: [newTask, ...state.tasks],
  }
}

export const updateTaskAction = (state, id, updates) => {
  return {
    ...state,
    tasks: state.tasks.map((task) =>
      task.id === id ? { ...task, ...updates, updatedAt: Date.now() } : task
    ),
  }
}

export const addDailyProgressAction = (state, taskId, progress) => {
  const today = new Date().toISOString().split('T')[0]
  return {
    ...state,
    tasks: state.tasks.map(task => {
      if (task.id === taskId) {
        const existingProgressIndex = task.dailyProgress.findIndex(p => p.date === today)
        let newDailyProgress = [...task.dailyProgress]
        if (existingProgressIndex >= 0) {
          newDailyProgress[existingProgressIndex] = { date: today, progress }
        } else {
          newDailyProgress.push({ date: today, progress })
        }
        
        // Calculate total progress based on duration and daily entries
        const totalProgress = Math.min(Math.round((newDailyProgress.length / task.duration) * 100), 100)
        
        return { 
          ...task, 
          dailyProgress: newDailyProgress, 
          progress: totalProgress,
          updatedAt: Date.now()
        }
      }
      return task
    })
  }
}

export const deleteTaskAction = (state, id) => {
  return {
    ...state,
    tasks: state.tasks.filter((task) => task.id !== id),
  }
}

export const verifyTaskAction = (state, id) => {
  return {
    ...state,
    tasks: state.tasks.map((task) =>
      task.id === id
        ? {
            ...task,
            isVerified: true,
            status: task.progress === 100 ? 'Completed' : 'Verified & In Progress',
            updatedAt: Date.now(),
          }
        : task
    ),
  }
}

export const incrementScoreAction = (state, amount) => {
  return {
    ...state,
    developerScore: state.developerScore + amount,
  }
}

export const setThemeAction = (state, theme) => {
  return {
    ...state,
    theme,
  }
}

export const toggleThemeAction = (state) => {
  return {
    ...state,
    theme: state.theme === 'dark' ? 'light' : 'dark',
  }
}

export const createGroupAction = (state, group) => {
  const newGroup = {
    ...group,
    id: 'squad_' + Math.random().toString(36).substr(2, 6),
    password: group.password || '',
    approvalRequired: group.approvalRequired || false,
    createdAt: Date.now(),
    members: [{ ...state.user, role: 'host', joinedAt: Date.now(), taskCompletionPercentage: 0 }],
    pendingMembers: [],
    messages: [],
    tasks: [],
    score: 0
  }
  return {
    ...state,
    groups: [...state.groups, newGroup],
  }
}

export const joinGroupAction = (state, groupId, password) => {
  return {
    ...state,
    groups: state.groups.map(group => {
      if (group.id === groupId) {
        if (group.password && group.password !== password) return group
        
        if (group.approvalRequired) {
          // Add to pending if not already there
          if (group.pendingMembers.some(m => m.id === state.user?.id)) return group
          return {
            ...group,
            pendingMembers: [...group.pendingMembers, { ...state.user, requestedAt: Date.now() }]
          }
        } else {
          // Direct join
          if (group.members.some(m => m.id === state.user?.id)) return group
          return {
            ...group,
            members: [...group.members, { ...state.user, role: 'member', joinedAt: Date.now(), taskCompletionPercentage: 0 }]
          }
        }
      }
      return group
    })
  }
}

export const approveMemberAction = (state, groupId, userId) => {
  return {
    ...state,
    groups: state.groups.map(group => {
      if (group.id === groupId) {
        const userToApprove = group.pendingMembers.find(m => m.id === userId)
        if (!userToApprove) return group
        return {
          ...group,
          pendingMembers: group.pendingMembers.filter(m => m.id !== userId),
          members: [...group.members, { ...userToApprove, role: 'member', joinedAt: Date.now(), taskCompletionPercentage: 0 }]
        }
      }
      return group
    })
  }
}

export const rejectMemberAction = (state, groupId, userId) => {
  return {
    ...state,
    groups: state.groups.map(group => 
      group.id === groupId 
        ? { ...group, pendingMembers: group.pendingMembers.filter(m => m.id !== userId) }
        : group
    )
  }
}

export const sendMessageAction = (state, groupId, message) => {
  const newMessage = {
    id: Date.now().toString(),
    text: message,
    senderId: state.user?.id,
    senderName: state.user?.name,
    timestamp: Date.now()
  }
  return {
    ...state,
    groups: state.groups.map(group => 
      group.id === groupId 
        ? { ...group, messages: [...(group.messages || []), newMessage] }
        : group
    )
  }
}

export const exitGroupAction = (state, groupId) => {
  return {
    ...state,
    groups: state.groups.map(group => 
      group.id === groupId 
        ? { ...group, members: group.members.filter(m => m.id !== state.user?.id) }
        : group
    )
  }
}

export const addGroupTaskAction = (state, groupId, task) => {
  const newTask = {
    ...task,
    id: Date.now().toString(),
    createdAt: Date.now(),
    progress: 0,
    duration: task.duration || 1,
    status: 'In Progress',
    priority: task.priority || 'Medium',
    deadline: task.deadline || null,
    isVerified: false
  }
  return {
    ...state,
    groups: state.groups.map(group => 
      group.id === groupId 
        ? { ...group, tasks: [...group.tasks, newTask] }
        : group
    )
  }
}

export const updateGroupTaskAction = (state, groupId, taskId, updates) => {
  return {
    ...state,
    groups: state.groups.map(group => {
      if (group.id === groupId) {
        const updatedTasks = group.tasks.map(task => 
          task.id === taskId ? { ...task, ...updates } : task
        )
        
        // Recalculate group score
        const totalProgress = updatedTasks.reduce((sum, t) => sum + (t.progress || 0), 0)
        const newScore = updatedTasks.length > 0 ? Math.round(totalProgress / updatedTasks.length) : 0
        
        return { 
          ...group, 
          tasks: updatedTasks,
          score: newScore
        }
      }
      return group
    })
  }
}

export const removeGroupMemberAction = (state, groupId, memberId) => {
  return {
    ...state,
    groups: state.groups.map((group) =>
      group.id === groupId
        ? {
            ...group,
            members: (group.members || []).filter((m) => m.id !== memberId),
          }
        : group
    ),
  }
}

export const updateSettingsAction = (state, settings) => {
  return {
    ...state,
    settings: { ...state.settings, ...settings }
  }
}
