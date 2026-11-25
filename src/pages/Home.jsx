import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useData } from '../DataContext.jsx'
import { STAGES, STAGE_HINTS, STATE_NAMES } from '../data.js'

export default function Home() {
  const { data } = useData()
  const nav = useNavigate()
  const [q, setQ] = useState('')
  const real = data.programs.filter((p) => !p.none_found)
  const national = real.filter((p) => p.national).length
  const top = data.states.filter((s) => s.rank).sort((a, b) => a.rank - b.rank)

  const search = (e) => {
    e.preventDefault()
    nav(q.trim() ? `/programs?q=${encodeURIComponent(q.trim())}` : '/programs')
  }

  return (
    <>
      <section className="hero">
        <div className="wrap hero-inner">
          <p className="kicker">For food hub operators</p>
          <h1>Find funding that fits where your food hub is today.</h1>
          <p className="lede">
            Grants, loans and state programs for food hubs, gathered in one place and sorted by the stage
            you're at. Built for new hubs who don't have a grant writer on staff.
          </p>
          <form className="hero-search" onSubmit={search} role="search">
            <label htmlFor="hero-q" className="sr-only">Search programs</label>
            <input
              id="hero-q"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Try “cold storage”, “working capital” or “USDA”"
            />
            <button type="submit">Search</button>
          </form>
          <div className="stats">
            <div><strong>{real.length}</strong><span>programs</span></div>
            <div><strong>{national}</strong><span>national options</span></div>
            <div><strong>51</strong><span>states + DC checked</span></div>
          </div>
        </div>
      </section>

      <section className="wrap pad">
        <h2 className="section-title">Start with your stage</h2>
        <div className="stage-grid">
          {STAGES.map((s, i) => (
            <Link key={s} to={`/programs?stage=${s}`} className="card stage-card">
              <span className="step">0{i + 1}</span>
              <h3>{s}</h3>
              <p>{STAGE_HINTS[s]}</p>
              <span className="count">{real.filter((p) => p.stages.includes(s)).length} programs →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="band">
        <div className="wrap pad split">
          <div>
            <p className="kicker">Where you are matters</p>
            <h2 className="section-title">Strongest state funding environments</h2>
            <p className="muted">
              We checked all 50 states and DC for hub-eligible grants, healthy food financing and active food and
              ag lenders. These ten stood out.
            </p>
            <Link to="/states" className="btn">See every state</Link>
          </div>
          <ol className="toplist">
            {top.map((s) => (
              <li key={s.state}>
                <Link to={`/states/${s.state}`}>
                  <span className="rank">{s.rank}</span>
                  <span>
                    <strong>{STATE_NAMES[s.state]}</strong>
                    <small>{s.why}</small>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="wrap pad">
        <div className="callout">
          <h2>Only 11.5% of eligible applicants were funded.</h2>
          <p>
            That's USDA's Local Food Promotion Program in FY2025. The big federal grants are competitive and their
            funding is uncertain, so this directory puts state programs, loans and private lenders right beside them.
          </p>
        </div>
      </section>
    </>
  )
}
