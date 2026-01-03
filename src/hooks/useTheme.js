import { useContext, useEffect } from 'react'
import AppContext from '../context/AppContext'

export function useTheme() {
  const context = useContext(AppContext)

  if (!context) {
    throw new Error('useTheme must be used within AppContextProvider')
  }

  const { theme, setTheme, toggleTheme } = context

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return { theme, setTheme, toggleTheme }
}
