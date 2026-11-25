import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useData } from '../DataContext.jsx'
import ProgramTable from '../components/ProgramTable.jsx'

const FEATURED = [1, 3, 8, 25, 6] // LFPP, VAPG, HFFI FARE grants, Rooted Farmers, Community Facilities

function Icon({ d }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  )
}

export default function Landing() {
  const { data } = useData()
  const nav = useNavigate()
  const [q, setQ] = useState('')
  const real = data.programs.filter((p) => !p.none_found)
  const featured = FEATURED.map((id) => real.find((p) => p.id === id)).filter(Boolean)
  const national = real.filter((p) => p.national).length
  const rolling = real.filter((p) => p.status === 'rolling').length

  const go = (e) => {
    e.preventDefault()
    nav(q.trim() ? `/directory?q=${encodeURIComponent(q.trim())}` : '/directory')
  }

  return (
    <>
      <section className="landing-hero">
        <div className="float f-note" aria-hidden="true">
          <p>Just starting out? Planning grants pay for feasibility studies and business plans.</p>
          <span className="pin" />
        </div>
        <div className="float f-award" aria-hidden="true">
          <small>Award</small>
          <strong>$25K–500K</strong>
          <div className="tags"><em>Planning</em><em>Startup</em><em>Scaling</em></div>
          <span className="muted">Local Food Promotion Program</span>
        </div>
        <div className="float f-mini" aria-hidden="true">
          <div className="f-mini-title">Startup grants · California</div>
          <div className="f-mini-row"><span>Farm to Community Food Hubs</span><em>Grant</em></div>
          <div className="f-mini-row"><span>Specialty Crop Block Grant</span><em>Grant</em></div>
          <div className="f-mini-row"><span>Farm to School Incubator</span><em>Grant</em></div>
        </div>
        <div className="float f-states" aria-hidden="true">
          <small>Strongest states</small>
          <div className="f-states-row"><b>PA</b><b>MA</b><b>MI</b><b>CA</b><b>NY</b></div>
          <span className="muted">51 checked</span>
        </div>

        <div className="wrap landing-center">
          <span className="pill">{real.length} programs · checked November 2026</span>
          <h1 className="landing-title">
            Find, compare and plan
            <span>funding for your food hub</span>
          </h1>
          <p className="landing-sub">
            Grants, loans and state programs for food hubs in one directory, sorted by the stage you're at and what
            you need to pay for.
          </p>
          <form className="landing-search" onSubmit={go} role="search">
            <label htmlFor="land-q" className="sr-only">Search the directory</label>
            <input id="land-q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Try “cold storage” or “working capital”" />
            <button type="submit">Search the directory</button>
          </form>
          <Link to="/browse" className="link-quiet center">or browse by stage, need or state →</Link>
        </div>
      </section>

      <div className="sources">
        <div className="wrap sources-inner">
          <span>Programs from</span>
          <b>USDA</b><b>SBA</b><b>State ag departments</b><b>CDFIs</b><b>Foundations</b>
        </div>
      </div>

      <section className="wrap pad">
        <div className="feature-head">
          <div>
            <p className="kicker">How it works</p>
            <h2 className="section-title big">Built for hubs without a grant writer</h2>
          </div>
          <p className="muted">
            Funding for food hubs is scattered across federal agencies, state departments, lenders and foundations.
            We gathered it into one place and checked every state.
          </p>
        </div>
        <div className="features">
          <Link to="/browse" className="feature">
            <span className="ficon"><Icon d="M3 17l6-6 4 4 8-8M14 7h7v7" /></span>
            <h3>Filter by your stage</h3>
            <p>Planning, startup, scaling or mature. See only what fits where your hub is today.</p>
          </Link>
          <Link to="/directory" className="feature">
            <span className="ficon"><Icon d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3" /></span>
            <h3>Search by what you need</h3>
            <p>Equipment, cold storage, trucks, buildings or working capital, across grants and loans.</p>
          </Link>
          <Link to="/states" className="feature">
            <span className="ficon"><Icon d="M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" /></span>
            <h3>Compare by state</h3>
            <p>Every state and DC, with local programs listed next to the national ones you can also use.</p>
          </Link>
        </div>
      </section>

      <section className="stats-band">
        <div className="wrap stats-inner">
          <div><strong>{real.length}</strong><span>funding programs</span></div>
          <div><strong>51</strong><span>states and DC checked</span></div>
          <div><strong>{national}</strong><span>national programs</span></div>
          <div><strong>{rolling}</strong><span>take applications any time</span></div>
        </div>
      </section>

      <section className="wrap pad">
        <p className="kicker">A first look</p>
        <h2 className="section-title big">Where many hubs start</h2>
        <ProgramTable
          title="Food hub funding directory · preview"
          programs={featured}
          footer={<Link to="/directory">See all {real.length} programs in the directory →</Link>}
        />
      </section>

      <section className="wrap pad-bottom">
        <div className="cta-band">
          <div>
            <h2>Only 11.5% of eligible applicants were funded.</h2>
            <p>
              That's USDA's Local Food Promotion Program in FY2025. Big federal grants are competitive, so the
              directory puts state programs, loans and private lenders right beside them.
            </p>
          </div>
          <Link to="/directory" className="btn light">Open the directory</Link>
        </div>
      </section>
    </>
  )
}
