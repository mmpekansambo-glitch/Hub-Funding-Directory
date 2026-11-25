import { Link, useParams } from 'react-router-dom'
import { useData } from '../DataContext.jsx'
import { STATE_NAMES } from '../data.js'
import ProgramTable from '../components/ProgramTable.jsx'
import NotFound from './NotFound.jsx'

export default function StatePage() {
  const { code } = useParams()
  const { data } = useData()
  const c = (code || '').toUpperCase()
  const s = data.states.find((x) => x.state === c)
  if (!s) return <NotFound />

  const local = data.programs.filter((p) => p.state === c)
  const programs = local.filter((p) => !p.none_found)
  const gaps = local.filter((p) => p.none_found)
  const national = data.programs.filter((p) => p.national && !p.none_found && !(/except/i.test(p.state) && p.state.includes(c)))

  return (
    <div className="wrap pad">
      <Link to="/states" className="back">← All states</Link>
      <p className="kicker">{s.rank ? `Ranked #${s.rank} of 51` : 'State profile'}</p>
      <h1 className="page-title">{STATE_NAMES[c]}</h1>
      {s.why && <p className="lede dark">{s.why}</p>}

      <div className="facts">
        <div><span>Programs found</span><strong>{programs.length}</strong></div>
        <div className="wide"><span>Largest available award</span><strong className="small">{s.largest_award || 'Not stated'}</strong></div>
      </div>

      {programs.length ? (
        <ProgramTable title={`Programs in ${STATE_NAMES[c]} · ${programs.length}`} programs={programs} />
      ) : (
        <p className="muted">No state-specific programs found yet.</p>
      )}

      {gaps.length > 0 && (
        <details className="gaps">
          <summary>Where we looked and found nothing ({gaps.length})</summary>
          <ul>
            {gaps.map((g) => (
              <li key={g.id}>
                <strong>{g.funds_what.replace(/^Category checked:\s*/i, '')}</strong>
                {g.eligibility_notes && <span> · {g.eligibility_notes}</span>}
              </li>
            ))}
          </ul>
        </details>
      )}

      <div className="callout slim">
        <p>
          Hubs in {STATE_NAMES[c]} can also apply to <strong>{national.length} national programs</strong>.{' '}
          <Link to={`/directory?state=${c}`}>See everything available in {STATE_NAMES[c]} →</Link>
        </p>
      </div>
    </div>
  )
}
