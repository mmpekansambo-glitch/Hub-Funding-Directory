import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useData } from '../DataContext.jsx'
import { STAGES, LEVELS, STATE_NAMES, STATUS_LABEL, NEEDS, KINDS } from '../data.js'
import ProgramTable, { splitName, letterOf } from '../components/ProgramTable.jsx'

const STATE_CODES = Object.keys(STATE_NAMES).sort((a, b) => STATE_NAMES[a].localeCompare(STATE_NAMES[b]))
const sortKey = (p) => splitName(p.program)[0].replace(/^(the|a)\s+/i, '').toLowerCase()

export default function Directory() {
  const { data } = useData()
  const [params, setParams] = useSearchParams()
  const get = (k) => params.get(k) || ''
  const q = get('q'), stage = get('stage'), level = get('level'), state = get('state')
  const status = get('status'), need = get('need'), kind = get('kind')
  const natl = params.get('natl') !== '0'

  const set = (k, v) => {
    const next = new URLSearchParams(params)
    if (v === '' || v == null) next.delete(k)
    else next.set(k, v)
    setParams(next, { replace: true })
  }

  const results = useMemo(() => {
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean)
    const list = data.programs.filter((p) => {
      if (p.none_found) return false
      if (stage && !p.stages.includes(stage)) return false
      if (level && p.level !== level) return false
      if (status && p.status !== status) return false
      if (need && !p.needs.includes(need)) return false
      if (kind && !p.kinds.includes(kind)) return false
      if (state) {
        const excluded = /except/i.test(p.state) && p.state.includes(state)
        const local = p.state === state || (!p.national && (p.state || '').includes(state))
        if (excluded) return false
        if (!local && !(natl && p.national)) return false
      }
      if (terms.length) {
        const hay = `${p.program} ${p.funds_what} ${p.eligibility_notes} ${p.state} ${STATE_NAMES[p.state] || ''}`.toLowerCase()
        if (!terms.every((t) => hay.includes(t))) return false
      }
      return true
    })
    return list.sort((a, b) => sortKey(a).localeCompare(sortKey(b)))
  }, [data, q, stage, level, state, status, need, kind, natl])

  const filtered = Boolean(q || stage || level || state || status || need || kind)
  const label = [
    kind && KINDS.find((k) => k.key === kind)?.label,
    need && NEEDS.find((n) => n.key === need)?.label,
    stage,
    level,
    state && STATE_NAMES[state],
    status && STATUS_LABEL[status],
    q && `“${q}”`,
  ].filter(Boolean)
  const title = `${filtered ? label.join(' · ') : 'A to Z'} · ${results.length} program${results.length === 1 ? '' : 's'}`
  const letters = [...new Set(results.map(letterOf))]

  return (
    <>
      <section className="lookup">
        <div className="wrap">
          <h1 className="lookup-title">The Hub Directory</h1>
          <div className="lookup-search" role="search">
            <label htmlFor="q" className="sr-only">Search programs</label>
            <input
              id="q"
              value={q}
              onChange={(e) => set('q', e.target.value)}
              placeholder="Search programs"
            />
          </div>
          <div className="filters">
            <div className="field">
              <label htmlFor="kind">Type of funding</label>
              <select id="kind" value={kind} onChange={(e) => set('kind', e.target.value)}>
                <option value="">Grants and loans</option>
                {KINDS.map((k) => <option key={k.key} value={k.key}>{k.label}</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor="need">What it pays for</label>
              <select id="need" value={need} onChange={(e) => set('need', e.target.value)}>
                <option value="">Anything</option>
                {NEEDS.map((n) => <option key={n.key} value={n.key}>{n.label}</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor="stage">Hub stage</label>
              <select id="stage" value={stage} onChange={(e) => set('stage', e.target.value)}>
                <option value="">Any stage</option>
                {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor="state">State</label>
              <select id="state" value={state} onChange={(e) => set('state', e.target.value)}>
                <option value="">All states</option>
                {STATE_CODES.map((c) => <option key={c} value={c}>{STATE_NAMES[c]}</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor="level">Funder</label>
              <select id="level" value={level} onChange={(e) => set('level', e.target.value)}>
                <option value="">All funders</option>
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
          <div className="lookup-meta">
            {state && (
              <label className="check">
                <input type="checkbox" checked={natl} onChange={(e) => set('natl', e.target.checked ? '' : '0')} />
                Include national programs
              </label>
            )}
            {filtered && <button className="link" onClick={() => setParams({}, { replace: true })}>Clear filters</button>}
          </div>
        </div>
      </section>

      <div className="wrap pad-sm">
        {!filtered && results.length > 40 && (
          <nav className="az" aria-label="Jump to letter">
            {letters.map((L) => <a key={L} href={`#letter-${L}`}>{L}</a>)}
          </nav>
        )}
        {results.length ? (
          <ProgramTable
            title={title}
            programs={results}
            letters={!filtered}
          />
        ) : (
          <div className="empty">
            <p>No matches.</p>
          </div>
        )}
      </div>
    </>
  )
}
