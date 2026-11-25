import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useData } from '../DataContext.jsx'

export default function States() {
  const { data } = useData()
  const [q, setQ] = useState('')
  const top = data.states.filter((s) => s.rank).sort((a, b) => a.rank - b.rank)
  const all = data.states
    .filter((s) => !q || s.name.toLowerCase().includes(q.toLowerCase()) || s.state.toLowerCase() === q.toLowerCase())
    .sort((a, b) => a.name.localeCompare(b.name))

  return (
    <div className="wrap pad">
      <h1 className="page-title">States</h1>

      <h2 className="section-title">Top ten</h2>
      <div className="top-grid">
        {top.map((s) => (
          <Link key={s.state} to={`/states/${s.state}`} className="card top-card">
            <span className="rank big">{s.rank}</span>
            <div>
              <h3>{s.name}</h3>
              <p>{s.why}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="row-head">
        <h2 className="section-title">All states</h2>
        <div className="field">
          <label htmlFor="sq" className="sr-only">Find a state</label>
          <input id="sq" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find a state" />
        </div>
      </div>
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>State</th>
              <th className="num">Programs</th>
              <th>Largest available award</th>
            </tr>
          </thead>
          <tbody>
            {all.map((s) => (
              <tr key={s.state}>
                <td>
                  <Link to={`/states/${s.state}`}>{s.name}</Link>
                  {s.rank && <span className="badge rank-badge">#{s.rank}</span>}
                </td>
                <td className="num">{s.programs_found}</td>
                <td>{s.largest_award}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
