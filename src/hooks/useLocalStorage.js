export function useLocalStorage() {
  const toJSON = (state) => JSON.stringify(state)
  const fromJSON = (json) => JSON.parse(json)

  const saveState = (key, state) => {
    try {
      const serializedState = toJSON(state)
      localStorage.setItem(key, serializedState)
    } catch (err) {
      console.error('Error saving state to localStorage:', err)
    }
  }

  const loadState = (key, defaultState) => {
    try {
      const serializedState = localStorage.getItem(key)
      if (serializedState === null) {
        return defaultState
      }
      return fromJSON(serializedState)
    } catch (err) {
      console.error('Error loading state from localStorage:', err)
      return defaultState
    }
  }

  return { saveState, loadState, toJSON, fromJSON }
}
