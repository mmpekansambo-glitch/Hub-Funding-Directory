import { Link, useParams } from 'react-router-dom'
import { useData } from '../DataContext.jsx'
import { STATE_NAMES } from '../data.js'
import { LevelBadge, StatusBadge, where } from '../components/ProgramCard.jsx'
import NotFound from './NotFound.jsx'

function Row({ label, children }) {
  if (!children) return null
  return (
    <div className="detail-row">
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  )
}

export default function Program() {
  const { id } = useParams()
  const { data } = useData()
  const p = data.programs.find((x) => String(x.id) === id)
  if (!p || p.none_found) return <NotFound />

  const unverified = /unverified/i.test(`${p.award_range} ${p.cycle_deadline} ${p.match_requirement}`)
  const stateCode = STATE_NAMES[p.state] ? p.state : null

  return (
    <div className="wrap pad narrow">
      <Link to="/" className="back">← Back to the directory</Link>
      <div className="card-top spaced">
        <LevelBadge level={p.level} />
        <span className="where">{where(p)}</span>
        <StatusBadge status={p.status} />
      </div>
      <h1 className="page-title">{p.program}</h1>
      <p className="lede dark">{p.funds_what}</p>

      <div className="stage-row">
        {['Planning', 'Startup', 'Scaling', 'Mature'].map((s) => (
          <span key={s} className={p.stages.includes(s) ? 'stage-pill on' : 'stage-pill'}>{s}</span>
        ))}
      </div>

      {unverified && (
        <p className="note">Some details below are marked unverified in our research. Check them with the funder.</p>
      )}

      <dl className="detail">
        <Row label="Award size">{p.award_range}</Row>
        <Row label="Match required">{p.match_requirement}</Row>
        <Row label="Timing and deadlines">{p.cycle_deadline}</Row>
        <Row label="Who can apply">{p.eligibility_notes}</Row>
        <Row label="Last checked">{p.date_verified}</Row>
      </dl>

      <div className="actions">
        {p.url && /^https?:\/\//.test(p.url) && (
          <a className="btn" href={p.url} target="_blank" rel="noopener noreferrer">Go to the source ↗</a>
        )}
        {stateCode && <Link className="btn ghost" to={`/states/${stateCode}`}>More in {STATE_NAMES[stateCode]}</Link>}
      </div>
    </div>
  )
}
