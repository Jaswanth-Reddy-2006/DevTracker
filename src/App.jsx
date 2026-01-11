import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AppContextProvider, AppContext } from './context/AppContext'
import { NotificationProvider } from './context/NotificationContext'
import { useContext } from 'react'
import './styles/themes.css'
import LandingPage from './components/LandingPage'
import Login from './components/Login'
import SignUp from './components/SignUp'
import Layout from './components/Layout'
import Dashboard from './components/Dashboard'
import Tasks from './components/Tasks'
import Groups from './components/Groups'
import Insights from './components/Insights'
import Settings from './components/Settings'
import Tracking from './components/Tracking'
import About from './components/About'
import Contact from './components/Contact'
import HowToUse from './components/HowToUse'
import Feedback from './components/Feedback'
import ActivityTracker from './components/ActivityTracker'
import AnalyticsMock from './components/mock/AnalyticsMock'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useContext(AppContext)
  
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }
  
  return <Layout user={user}>{children}</Layout>
}

function App() {
  return (
    <NotificationProvider>
      <AppContextProvider>
        <Router>
          <ActivityTracker />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/how-to-use" element={<HowToUse />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <AnalyticsMock />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <Tasks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/groups"
            element={
              <ProtectedRoute>
                <Groups />
              </ProtectedRoute>
            }
          />
          <Route
            path="/insights"
            element={
              <ProtectedRoute>
                <Insights />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tracking"
            element={
              <ProtectedRoute>
                <Tracking />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      </AppContextProvider>
    </NotificationProvider>
  )
}

export default App
