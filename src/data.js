import { createClient } from '@supabase/supabase-js'

export const STAGES = ['Planning', 'Startup', 'Scaling', 'Mature']
export const LEVELS = ['Federal', 'State', 'Private']

export const STAGE_HINTS = {
  Planning: 'Feasibility studies, business plans, partnerships',
  Startup: 'First equipment, working capital, early operations',
  Scaling: 'More capacity: cold storage, trucks, new markets',
  Mature: 'Facilities, refinancing, long-term growth',
}

export const STATE_NAMES = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California', CO: 'Colorado',
  CT: 'Connecticut', DE: 'Delaware', DC: 'District of Columbia', FL: 'Florida', GA: 'Georgia',
  HI: 'Hawaiʻi', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa', KS: 'Kansas',
  KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland', MA: 'Massachusetts',
  MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi', MO: 'Missouri', MT: 'Montana',
  NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire', NJ: 'New Jersey', NM: 'New Mexico',
  NY: 'New York', NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio', OK: 'Oklahoma',
  OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina', SD: 'South Dakota',
  TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont', VA: 'Virginia', WA: 'Washington',
  WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming',
}

export function parseStages(text = '') {
  const t = text.toLowerCase()
  if (t.startsWith('all')) return [...STAGES]
  return STAGES.filter((s) => t.includes(s.toLowerCase()))
}

// The sheet's deadline column is free text, so this is a rough signal, not a guarantee.
export function windowStatus(cycle = '') {
  const t = cycle.toLowerCase()
  if (/rolling|ongoing|year-round|through lenders|through cdcs|through intermediaries|contact form|no end date/.test(t)) return 'rolling'
  if (/closed|lapsed|not posted|not yet posted|not announced|tba/.test(t)) return 'closed'
  return 'check'
}

export const STATUS_LABEL = {
  rolling: 'Rolling / ongoing',
  closed: 'Between rounds',
  check: 'Check dates',
}

export function isNational(p) {
  return p.level === 'Federal' || /^(all|national|varies)/i.test(p.state || '')
}

function enrich(raw) {
  const programs = raw.programs.map((p) => ({
    ...p,
    stages: parseStages(p.hub_stage),
    status: windowStatus(p.cycle_deadline),
    national: isNational(p),
  }))
  const states = raw.states.map((s) => ({ ...s, name: STATE_NAMES[s.state] || s.state }))
  return { ...raw, programs, states }
}

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

export async function loadData() {
  if (url && key) {
    try {
      const sb = createClient(url, key)
      const [p, s] = await Promise.all([
        sb.from('programs').select('*').order('id').range(0, 4999),
        sb.from('states').select('*').order('state'),
      ])
      if (p.error) throw p.error
      if (s.error) throw s.error
      return enrich({ programs: p.data, states: s.data, source: 'supabase', verified: '2026-11-22' })
    } catch (err) {
      console.warn('Supabase unavailable, using bundled data', err)
    }
  }
  const local = (await import('../data/directory.json')).default
  return enrich({ ...local, source: 'bundled' })
}
