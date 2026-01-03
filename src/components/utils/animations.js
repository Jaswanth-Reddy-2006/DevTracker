export function randomInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function animateNumber(from, to) {
  const steps = 10
  const increment = (to - from) / steps
  
  const values = []
  for (let i = 0; i <= steps; i++) {
    values.push(Math.floor(from + increment * i))
  }
  return values
}

export function getRandomActivity() {
  const activities = [
    { name: 'Coding', type: 'active', color: 'bg-green-500' },
    { name: 'YouTube', type: 'educational', color: 'bg-blue-500' },
    { name: 'Instagram', type: 'distraction', color: 'bg-red-500' },
    { name: 'LeetCode', type: 'active', color: 'bg-yellow-500' },
    { name: 'Documentation', type: 'educational', color: 'bg-blue-500' },
  ]
  return activities[Math.floor(Math.random() * activities.length)]
}
