import { useEffect } from 'react'
import { NavLink, Link, Outlet, useLocation } from 'react-router-dom'
import { useData } from '../DataContext.jsx'

export function Flower({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="32" r="30" fill="var(--green)" />
      <g fill="var(--sand)">
        <ellipse cx="32" cy="20" rx="7" ry="11" />
        <ellipse cx="32" cy="44" rx="7" ry="11" />
        <ellipse cx="20" cy="32" rx="11" ry="7" />
        <ellipse cx="44" cy="32" rx="11" ry="7" />
      </g>
      <circle cx="32" cy="32" r="5" fill="var(--brown)" />
    </svg>
  )
}

export default function Layout() {
  const { loading, error, data } = useData()
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo(0, 0), [pathname])

  return (
    <div className="shell">
      <a className="skip" href="#main">Skip to content</a>
      <header className="topbar">
        <div className="wrap topbar-inner">
          <Link to="/" className="brand">
            <Flower />
            <span>
              <strong>The Funding Directory</strong>
              <small>for food hubs</small>
            </span>
          </Link>
          <nav className="nav">
            <NavLink to="/directory">Directory</NavLink>
            <NavLink to="/browse">Browse</NavLink>
            <NavLink to="/states">By state</NavLink>
            <NavLink to="/about">About</NavLink>
          </nav>
        </div>
      </header>
      <main id="main">
        {loading && <div className="wrap pad"><p className="muted">Loading the directory…</p></div>}
        {error && <div className="wrap pad"><p>Sorry, the directory could not load. Please refresh.</p></div>}
        {data && <Outlet />}
      </main>
      <footer className="footer">
        <div className="wrap footer-inner">
          <p>
            <strong>The Funding Directory</strong> · grants, loans and state programs for food hubs. Programs were last checked on{' '}
            {data?.verified || '2026-11-22'}. Always confirm details with the funder before applying.
          </p>
        </div>
      </footer>
    </div>
  )
}
