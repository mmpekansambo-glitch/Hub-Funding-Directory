import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useData } from '../DataContext.jsx'
import { STAGES, LEVELS, STATE_NAMES, STATUS_LABEL } from '../data.js'
import ProgramCard from '../components/ProgramCard.jsx'

const STATE_CODES = Object.keys(STATE_NAMES).sort((a, b) => STATE_NAMES[a].localeCompare(STATE_NAMES[b]))

export default function Directory() {
  const { data } = useData()
  const [params, setParams] = useSearchParams()
  const q = params.get('q') || ''
  const stage = params.get('stage') || ''
  const level = params.get('level') || ''
  const state = params.get('state') || ''
  const status = params.get('status') || ''
  const natl = params.get('natl') !== '0'

  const set = (k, v) => {
    const next = new URLSearchParams(params)
    if (v === '' || v == null) next.delete(k)
    else next.set(k, v)
    setParams(next, { replace: true })
  }

  const results = useMemo(() => {
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean)
    return data.programs.filter((p) => {
      if (p.none_found) return false
      if (stage && !p.stages.includes(stage)) return false
      if (level && p.level !== level) return false
      if (status && p.status !== status) return false
      if (state) {
        const local = p.state === state || (p.state || '').includes(state)
        if (!local && !(natl && p.national)) return false
        if (p.national && /except/i.test(p.state) && p.state.includes(state)) return false
      }
      if (terms.length) {
        const hay = `${p.program} ${p.funds_what} ${p.eligibility_notes} ${p.state} ${STATE_NAMES[p.state] || ''}`.toLowerCase()
        if (!terms.every((t) => hay.includes(t))) return false
      }
      return true
    })
  }, [data, q, stage, level, state, status, natl])

  const sorted = useMemo(() => {
    // Programs specific to the chosen state first, then national ones.
    if (!state) return results
    return [...results].sort((a, b) => Number(a.national) - Number(b.national))
  }, [results, state])

  const active = q || stage || level || state || status

  return (
    <div className="wrap pad">
      <p className="kicker">Directory</p>
      <h1 className="page-title">Funding programs</h1>
      <p className="muted intro">
        Filter by your hub's stage and state. Programs are checked by hand, so always confirm the current round
        with the funder.
      </p>

      <div className="filters">
        <div className="field grow">
          <label htmlFor="q">Search</label>
          <input id="q" value={q} onChange={(e) => set('q', e.target.value)} placeholder="Keyword, funder or need" />
        </div>
        <div className="field">
          <label htmlFor="state">State</label>
          <select id="state" value={state} onChange={(e) => set('state', e.target.value)}>
            <option value="">All states</option>
            {STATE_CODES.map((c) => <option key={c} value={c}>{STATE_NAMES[c]}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="level">Type</label>
          <select id="level" value={level} onChange={(e) => set('level', e.target.value)}>
            <option value="">Federal, state and private</option>
            {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="status">Timing</label>
          <select id="status" value={status} onChange={(e) => set('status', e.target.value)}>
            <option value="">Any</option>
            {Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
      </div>

      <div className="chips" role="group" aria-label="Hub stage">
        <span className="chips-label">Hub stage</span>
        <button className={!stage ? 'chip on' : 'chip'} onClick={() => set('stage', '')}>Any stage</button>
        {STAGES.map((s) => (
          <button key={s} className={stage === s ? 'chip on' : 'chip'} onClick={() => set('stage', stage === s ? '' : s)}>
            {s}
          </button>
        ))}
        {state && (
          <label className="check">
            <input type="checkbox" checked={natl} onChange={(e) => set('natl', e.target.checked ? '' : '0')} />
            Include national programs
          </label>
        )}
      </div>

      <div className="result-bar">
        <span><strong>{sorted.length}</strong> program{sorted.length === 1 ? '' : 's'}</span>
        {active && <button className="link" onClick={() => setParams({}, { replace: true })}>Clear filters</button>}
      </div>

      {sorted.length ? (
        <div className="grid">
          {sorted.map((p) => <ProgramCard key={p.id} p={p} />)}
        </div>
      ) : (
        <div className="empty">
          <p>No programs match those filters. Try a broader stage or clear the search.</p>
        </div>
      )}
    </div>
  )
}
