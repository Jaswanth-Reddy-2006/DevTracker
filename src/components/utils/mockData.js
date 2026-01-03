export function generateMockTasks() {
  return [
    {
      id: '1',
      name: 'Solve 10 LeetCode problems',
      activityType: 'Coding',
      targetDuration: 120,
      progress: Math.floor(Math.random() * 30),
      status: 'Tracking...',
      difficulty: 'Medium',
      createdAt: Date.now(),
    },
    {
      id: '2',
      name: 'Watch DSA videos',
      activityType: 'Video',
      targetDuration: 60,
      progress: Math.floor(Math.random() * 30),
      status: 'Tracking...',
      difficulty: 'Easy',
      createdAt: Date.now(),
    },
    {
      id: '3',
      name: 'Read System Design notes',
      activityType: 'Reading',
      targetDuration: 90,
      progress: Math.floor(Math.random() * 30),
      status: 'Tracking...',
      difficulty: 'Hard',
      createdAt: Date.now(),
    },
  ]
}

export function generateMockActivities() {
  const activities = [
    { id: '1', activity: 'Coding', type: 'active' },
    { id: '2', activity: 'YouTube', type: 'educational' },
    { id: '3', activity: 'LeetCode', type: 'active' },
    { id: '4', activity: 'Documentation', type: 'educational' },
  ]
  return activities
}

export function generateMockGroupMembers() {
  return [
    {
      id: '1',
      name: 'Alex Chen',
      taskCompletionPercentage: 85,
      developerScore: 842,
      isOnline: true,
      rank: 1,
    },
    {
      id: '2',
      name: 'Jordan Smith',
      taskCompletionPercentage: 72,
      developerScore: 761,
      isOnline: true,
      rank: 2,
    },
    {
      id: '3',
      name: 'Sam Patel',
      taskCompletionPercentage: 68,
      developerScore: 698,
      isOnline: false,
      rank: 3,
    },
    {
      id: '4',
      name: 'Casey Williams',
      taskCompletionPercentage: 91,
      developerScore: 923,
      isOnline: true,
      rank: 4,
    },
    {
      id: '5',
      name: 'Morgan Lee',
      taskCompletionPercentage: 55,
      developerScore: 612,
      isOnline: true,
      rank: 5,
    },
  ]
}

export function generateMockInsights() {
  return [
    "You planned 3h of coding but lost 42 mins to entertainment.",
    "Your focus peaks between 8 AM and 11 AM.",
    "Group productivity increased by 23% after competitive scoring.",
    "You're 15% ahead of group average on task completion.",
    "Most active learning period: Tuesday evenings.",
    "You completed 12 tasks this week - 40% more than last week.",
  ]
}
