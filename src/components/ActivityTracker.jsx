import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import axios from 'axios'
import { auth } from '../firebase'

const API_URL = 'http://localhost:5000/api'

export default function ActivityTracker() {
  const location = useLocation()
  const startTimeRef = useRef(Date.now())
  const currentPathRef = useRef(location.pathname)

  const sendSignal = async (path, duration) => {
    if (duration < 5) return // Don't track very short visits

    try {
      const user = auth.currentUser
      if (!user) return

      const token = await user.getIdToken()
      
      const appName = 'DevTracker Web'
      let category = 'Operational'
      
      if (path.includes('tasks')) category = 'Coding'
      if (path.includes('insights')) category = 'Educational'
      if (path.includes('groups')) category = 'Social'

      await axios.post(`${API_URL}/signals`, {
        source: 'Browser',
        appOrDomain: appName,
        category: category,
        startTime: new Date(startTimeRef.current).toISOString(),
        endTime: new Date().toISOString(),
        durationInSeconds: Math.floor(duration)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
    } catch (error) {
      console.error('Failed to send activity signal:', error)
    }
  }

  useEffect(() => {
    // When location changes, send signal for the PREVIOUS path
    const now = Date.now()
    const duration = (now - startTimeRef.current) / 1000
    
    if (currentPathRef.current !== location.pathname) {
      sendSignal(currentPathRef.current, duration)
      
      // Reset for new path
      startTimeRef.current = now
      currentPathRef.current = location.pathname
    }

    // Also send signal periodically for long stays
    const interval = setInterval(() => {
      const currentDuration = (Date.now() - startTimeRef.current) / 1000
      if (currentDuration >= 60) {
        sendSignal(currentPathRef.current, currentDuration)
        startTimeRef.current = Date.now() // Reset start time for next interval
      }
    }, 60000)

    return () => clearInterval(interval)
  }, [location])

  // Handle tab close/navigation away
  useEffect(() => {
    const handleBeforeUnload = () => {
      const duration = (Date.now() - startTimeRef.current) / 1000
      sendSignal(currentPathRef.current, duration)
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  return null // This component doesn't render anything
}
