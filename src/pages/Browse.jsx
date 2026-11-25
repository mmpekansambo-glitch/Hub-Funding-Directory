import { Link } from 'react-router-dom'
import { useData } from '../DataContext.jsx'
import { STAGES, STAGE_HINTS, STATE_NAMES, NEEDS, KINDS } from '../data.js'

export default function Browse() {
  const { data } = useData()
  const real = data.programs.filter((p) => !p.none_found)
  const count = (fn) => real.filter(fn).length
  const top = data.states.filter((s) => s.rank).sort((a, b) => a.rank - b.rank)
  const states = [...data.states].sort((a, b) => a.name.localeCompare(b.name))

  return (
    <>
      <div className="wrap pad">
        <p className="kicker">Browse</p>
        <h1 className="page-title">Find your way in</h1>
        <p className="muted intro">Pick a starting point and we'll show you the matching programs in the directory.</p>

        <h2 className="section-title">By hub stage</h2>
        <div className="stage-grid">
          {STAGES.map((s, i) => (
            <Link key={s} to={`/?stage=${s}`} className="card stage-card">
              <span className="step">0{i + 1}</span>
              <h3>{s}</h3>
              <p>{STAGE_HINTS[s]}</p>
              <span className="count">{count((p) => p.stages.includes(s))} programs →</span>
            </Link>
          ))}
        </div>

        <h2 className="section-title spaced-top">By what you need to pay for</h2>
        <div className="need-grid">
          {NEEDS.map((n) => (
            <Link key={n.key} to={`/?need=${n.key}`} className="card need-card">
              <h3>{n.label}</h3>
              <p>{n.hint}</p>
              <span className="count">{count((p) => p.needs.includes(n.key))} programs →</span>
            </Link>
          ))}
        </div>

        <h2 className="section-title spaced-top">By type of funding</h2>
        <div className="need-grid two">
          {KINDS.map((k) => (
            <Link key={k.key} to={`/?kind=${k.key}`} className="card need-card kind-card">
              <h3>{k.label}</h3>
              <span className="count">{count((p) => p.kinds.includes(k.key))} programs →</span>
            </Link>
          ))}
        </div>

        <h2 className="section-title spaced-top">By state</h2>
        <div className="state-tiles">
          {states.map((s) => (
            <Link key={s.state} to={`/states/${s.state}`} className={s.rank ? 'state-tile top' : 'state-tile'} title={s.name}>
              <strong>{s.state}</strong>
              <span>{s.name}</span>
            </Link>
          ))}
        </div>
        <p className="muted small">Highlighted states are the ten strongest funding environments for food hubs.</p>
      </div>

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
