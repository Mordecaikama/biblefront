import React, { useState, createContext } from 'react'
import axios from 'axios'

const Context = createContext()

function ContextProvider({ children }) {
  const [user, setUser] = useState(null)
  const [Settings, setSettings] = useState(null)

  axios.defaults.withCredentials = true

  const isAuthenticated = (key = 'book') => {
    if (localStorage.getItem(key)) {
      return JSON.parse(localStorage.getItem(key))
    } else {
      return false
    }
  }
  function AddTolocalStorage(key = 'book', data) {
    // localStorage.removeItem('cart')
    localStorage.setItem(key, JSON.stringify(data))
  }
  return (
    <Context.Provider
      value={{
        isAuthenticated,
        AddTolocalStorage,
        user,
        setUser,
        Settings,
        setSettings,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export { ContextProvider, Context }
