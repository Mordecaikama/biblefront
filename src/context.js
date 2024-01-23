import React, { useState, useEffect, createContext } from 'react'

const Context = createContext()

function ContextProvider({ children }) {
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
    <Context.Provider value={{ isAuthenticated, AddTolocalStorage }}>
      {children}
    </Context.Provider>
  )
}

export { ContextProvider, Context }
