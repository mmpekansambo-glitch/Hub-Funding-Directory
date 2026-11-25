import { createContext, useCallback, useContext, useEffect, useState } from 'react'

// Saved programs live in this browser only (no accounts yet).
const KEY = 'hubdirectory.saved.v1'
const Ctx = createContext(null)

function read() {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || '[]')
    return Array.isArray(v) ? v : []
  } catch {
    return []
  }
}

export function SavedProvider({ children }) {
  const [ids, setIds] = useState(read)
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(ids)) } catch { /* storage blocked */ }
  }, [ids])
  useEffect(() => {
    const sync = (e) => { if (e.key === KEY) setIds(read()) }
    window.addEventListener('storage', sync)
    return () => window.removeEventListener('storage', sync)
  }, [])
  const toggle = useCallback((id) => setIds((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id])), [])
  const clear = useCallback(() => setIds([]), [])
  return <Ctx.Provider value={{ ids, has: (id) => ids.includes(id), toggle, clear }}>{children}</Ctx.Provider>
}

export const useSaved = () => useContext(Ctx)
