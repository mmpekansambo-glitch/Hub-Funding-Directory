import { Link } from 'react-router-dom'
import { STATUS_LABEL, STATE_NAMES } from '../data.js'

export function StatusBadge({ status }) {
  return <span className={`badge status-${status}`}>{STATUS_LABEL[status]}</span>
}

export function LevelBadge({ level }) {
  return <span className={`badge level-${(level || '').toLowerCase()}`}>{level}</span>
}

export function where(p) {
  if (p.national) return p.state && !/^all$/i.test(p.state) ? p.state : 'Nationwide'
  return STATE_NAMES[p.state] || p.state
}

export default function ProgramCard({ p }) {
  return (
    <Link to={`/programs/${p.id}`} className="card program-card">
      <div className="card-top">
        <LevelBadge level={p.level} />
        <span className="where">{where(p)}</span>
      </div>
      <h3>{p.program}</h3>
      <p className="funds">{p.funds_what}</p>
      <dl className="mini">
        <div>
          <dt>Award</dt>
          <dd>{p.award_range || 'Not stated'}</dd>
        </div>
        <div>
          <dt>Stage</dt>
          <dd>{p.stages.length ? p.stages.join(' · ') : 'Not specified'}</dd>
        </div>
      </dl>
      <div className="card-foot">
        <StatusBadge status={p.status} />
        <span className="more">Details →</span>
      </div>
    </Link>
  )
}
