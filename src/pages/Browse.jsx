import { useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useData } from '../DataContext.jsx'
import { STAGES, NEEDS, KINDS, LEVELS } from '../data.js'

const CUTS = [
  { key: 'stage', label: 'Hub stage', hint: 'Where your hub is today', icon: 'M3 17l6-6 4 4 8-8M14 7h7v7' },
  { key: 'need', label: 'What it pays for', hint: 'Equipment, buildings, trucks and more', icon: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3' },
  { key: 'kind', label: 'Type of funding', hint: 'Grants or loans', icon: 'M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' },
  { key: 'state', label: 'State', hint: 'All 50 states and DC', icon: 'M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z' },
  { key: 'funder', label: 'Funder', hint: 'Federal, state or private', icon: 'M3 21h18M5 21V10l7-5 7 5v11M9 21v-6h6v6' },
]

function Icon({ d }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  )
}

function Option({ to, title, hint, count }) {
  return (
    <Link to={to} className="card need-card">
      <h3>{title}</h3>
      {hint && <p>{hint}</p>}
      <span className="count">{count} programs →</span>
    </Link>
  )
}

export default function Browse() {
  const { data } = useData()
  const [params, setParams] = useSearchParams()
  const by = params.get('by') || ''
  const panel = useRef(null)
  const real = data.programs.filter((p) => !p.none_found)
  const count = (fn) => real.filter(fn).length
  const states = [...data.states].sort((a, b) => a.name.localeCompare(b.name))
  const cut = CUTS.find((c) => c.key === by)

  useEffect(() => {
    if (cut && panel.current) panel.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [by]) // eslint-disable-line react-hooks/exhaustive-deps

  const choose = (key) => setParams(key === by ? {} : { by: key }, { replace: true })

  return (
    <div className="wrap pad">
      <h1 className="page-title">Browse</h1>

      <div className="cuts" role="tablist" aria-label="Ways to browse">
        {CUTS.map((c) => (
          <button
            key={c.key}
            role="tab"
            aria-selected={by === c.key}
            aria-controls="browse-panel"
            className={by === c.key ? 'cut on' : 'cut'}
            onClick={() => choose(c.key)}
          >
            <span className="ficon"><Icon d={c.icon} /></span>
            <strong>{c.label}</strong>
          </button>
        ))}
      </div>

      {cut ? (
        <section id="browse-panel" role="tabpanel" className="cut-panel" ref={panel}>
          <div className="cut-panel-head">
            <h2 className="section-title">Browse by {cut.label.toLowerCase()}</h2>
            <button className="link" onClick={() => choose(by)}>Close</button>
          </div>

          {by === 'stage' && (
            <div className="stage-grid">
              {STAGES.map((s, i) => (
                <Link key={s} to={`/directory?stage=${s}`} className="card stage-card">
                  <span className="step">0{i + 1}</span>
                  <h3>{s}</h3>
                  <span className="count">{count((p) => p.stages.includes(s))} programs →</span>
                </Link>
              ))}
            </div>
          )}

          {by === 'need' && (
            <div className="need-grid">
              {NEEDS.map((n) => (
                <Option key={n.key} to={`/directory?need=${n.key}`} title={n.label} count={count((p) => p.needs.includes(n.key))} />
              ))}
            </div>
          )}

          {by === 'kind' && (
            <div className="need-grid two">
              {KINDS.map((k) => (
                <Option key={k.key} to={`/directory?kind=${k.key}`} title={k.label} count={count((p) => p.kinds.includes(k.key))} />
              ))}
            </div>
          )}

          {by === 'funder' && (
            <div className="need-grid">
              {LEVELS.map((l) => (
                <Option key={l} to={`/directory?level=${l}`} title={l} count={count((p) => p.level === l)} />
              ))}
            </div>
          )}

          {by === 'state' && (
            <>
              <div className="state-tiles">
                {states.map((s) => (
                  <Link key={s.state} to={`/directory?state=${s.state}`} className={s.rank ? 'state-tile top' : 'state-tile'} title={s.name}>
                    <strong>{s.state}</strong>
                    <span>{s.name}</span>
                  </Link>
                ))}
              </div>
              <p className="muted small"><Link to="/states">State profiles →</Link></p>
            </>
          )}
        </section>
      ) : null}
    </div>
  )
}
