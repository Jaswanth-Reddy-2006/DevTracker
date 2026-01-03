export const addTaskAction = (state, task) => {
  const newTask = {
    ...task,
    id: Date.now().toString(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
    completedAt: null,
    priority: task.priority || 'Medium',
    tags: task.tags || [],
    progress: task.progress || 0,
    status: task.status || 'Tracking...',
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

export const deleteTaskAction = (state, id) => {
  return {
    ...state,
    tasks: state.tasks.filter((task) => task.id !== id),
  }
}

export const completeTaskAction = (state, id) => {
  return {
    ...state,
    tasks: state.tasks.map((task) =>
      task.id === id
        ? {
            ...task,
            progress: 100,
            status: 'Completed',
            completedAt: Date.now(),
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

export const addGroupAction = (state, group) => {
  const newGroup = {
    ...group,
    id: Date.now().toString(),
    createdAt: Date.now(),
  }
  return {
    ...state,
    groups: [newGroup, ...state.groups],
  }
}

export const updateGroupAction = (state, id, updates) => {
  return {
    ...state,
    groups: state.groups.map((group) =>
      group.id === id ? { ...group, ...updates } : group
    ),
  }
}

export const deleteGroupAction = (state, id) => {
  return {
    ...state,
    groups: state.groups.filter((group) => group.id !== id),
  }
}

export const addGroupMemberAction = (state, groupId, member) => {
  return {
    ...state,
    groups: state.groups.map((group) =>
      group.id === groupId
        ? {
            ...group,
            members: [...(group.members || []), { ...member, id: Date.now().toString(), joinedAt: Date.now() }],
          }
        : group
    ),
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

export const updateFocusRatioAction = (state, ratio) => {
  return {
    ...state,
    focusRatio: Math.min(ratio, 100),
  }
}

export const addActivityAction = (state, activity) => {
  const newActivity = {
    ...activity,
    id: Date.now().toString(),
  }
  return {
    ...state,
    activities: [newActivity, ...state.activities].slice(0, 10),
  }
}

export const updateInsightsAction = (state, insights) => {
  return {
    ...state,
    insights,
  }
}
