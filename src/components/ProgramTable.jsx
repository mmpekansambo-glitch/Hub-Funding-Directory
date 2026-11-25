import { Link } from 'react-router-dom'
import { where } from './ProgramCard.jsx'

export function splitName(name = '') {
  // "Value-Added Producer Grant (VAPG), USDA RD" -> ["Value-Added Producer Grant (VAPG)", "USDA RD"]
  const i = name.indexOf(', ')
  return i > 0 && !/^track\b/i.test(name.slice(i + 2)) ? [name.slice(0, i), name.slice(i + 2)] : [name, '']
}

function shortAward(a = '') {
  if (!a) return 'Not stated'
  return a.length > 60 ? a.slice(0, 57).replace(/\s+\S*$/, '') + '…' : a
}

const letterOf = (p) => {
  const c = splitName(p.program)[0].replace(/^(the|a)\s+/i, '').charAt(0).toUpperCase()
  return /[A-Z]/.test(c) ? c : '#'
}

export default function ProgramTable({ title, programs, letters = false, footer }) {
  let last = null
  return (
    <div className="ptable">
      <div className="ptable-title">{title}</div>
      <div className="ptable-head" aria-hidden="true">
        <span>Program</span>
        <span>Hub stage</span>
        <span>Award</span>
        <span>Next window</span>
      </div>
      <ul className="ptable-body">
        {programs.map((p) => {
          const [name, funder] = splitName(p.program)
          const L = letterOf(p)
          const divider = letters && L !== last
          last = L
          return (
            <li key={p.id}>
              {divider && <div className="ptable-letter" id={`letter-${L}`}>{L}</div>}
              <Link to={`/programs/${p.id}`} className="ptable-row">
                <span className="pt-name">
                  <strong>{name}</strong>
                  <small>{[funder, where(p)].filter(Boolean).join(' · ')}</small>
                </span>
                <span className="pt-stages">
                  {p.stages.length ? p.stages.map((s) => <em key={s}>{s}</em>) : <small className="muted">Not specified</small>}
                </span>
                <span className="pt-award"><b className="pt-label">Award</b>{shortAward(p.award_range)}</span>
                <span className="pt-window"><b className="pt-label">Next window</b>{p.window}</span>
              </Link>
            </li>
          )
        })}
      </ul>
      {footer && <div className="ptable-foot">{footer}</div>}
    </div>
  )
}

export { letterOf }
