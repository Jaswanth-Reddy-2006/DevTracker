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
