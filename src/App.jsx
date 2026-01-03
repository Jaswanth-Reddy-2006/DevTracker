import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AppContextProvider } from './context/AppContext'
import './styles/themes.css'
import LandingPage from './components/LandingPage'
import Layout from './components/Layout'
import Dashboard from './components/Dashboard'
import Tasks from './components/Tasks'
import Groups from './components/Groups'
import Insights from './components/Insights'

const mockUser = {
  name: 'Student Developer',
  badge: 'Developer Score: 742'
}

function App() {
  return (
    <AppContextProvider>
      <Router>
        <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/dashboard"
          element={
            <Layout user={mockUser}>
              <Dashboard />
            </Layout>
          }
        />
        <Route
          path="/tasks"
          element={
            <Layout user={mockUser}>
              <Tasks />
            </Layout>
          }
        />
        <Route
          path="/groups"
          element={
            <Layout user={mockUser}>
              <Groups />
            </Layout>
          }
        />
        <Route
          path="/insights"
          element={
            <Layout user={mockUser}>
              <Insights />
            </Layout>
          }
        />
      </Routes>
      </Router>
    </AppContextProvider>
  )
}

export default App
