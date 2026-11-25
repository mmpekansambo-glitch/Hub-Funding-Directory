import { createContext, useContext, useEffect, useState } from 'react'
import { loadData } from './data.js'

const Ctx = createContext(null)

export function DataProvider({ children }) {
  const [state, setState] = useState({ loading: true, data: null, error: null })
  useEffect(() => {
    loadData()
      .then((data) => setState({ loading: false, data, error: null }))
      .catch((error) => setState({ loading: false, data: null, error }))
  }, [])
  return <Ctx.Provider value={state}>{children}</Ctx.Provider>
}

export const useData = () => useContext(Ctx)
