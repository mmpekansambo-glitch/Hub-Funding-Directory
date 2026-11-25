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
        <div className="float f-award" aria-hidden="true">
          <small>Award</small>
          <strong>$25K–500K</strong>
          <div className="tags"><em>Planning</em><em>Startup</em><em>Scaling</em></div>
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
        </div>

        <div className="wrap landing-center">
          <h1 className="landing-title">
            Find, compare and plan
            <span>funding for your food hub</span>
          </h1>
          <form className="landing-search" onSubmit={go} role="search">
            <label htmlFor="land-q" className="sr-only">Search the directory</label>
            <input id="land-q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search programs" />
            <button type="submit">Search</button>
          </form>
        </div>
      </section>

      <div className="sources">
        <div className="wrap sources-inner">
          <span>Programs from</span>
          <b>USDA</b><b>SBA</b><b>State ag departments</b><b>CDFIs</b><b>Foundations</b>
        </div>
      </div>

      <section className="wrap pad">
        <div className="features">
          <Link to="/browse" className="feature">
            <span className="ficon"><Icon d="M3 17l6-6 4 4 8-8M14 7h7v7" /></span>
            <h3>Filter by your stage</h3>
          </Link>
          <Link to="/directory" className="feature">
            <span className="ficon"><Icon d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3" /></span>
            <h3>Search by what you need</h3>
          </Link>
          <Link to="/states" className="feature">
            <span className="ficon"><Icon d="M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" /></span>
            <h3>Compare by state</h3>
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
        <h2 className="section-title big">Popular programs</h2>
        <ProgramTable
          title={`${featured.length} of ${real.length} programs`}
          programs={featured}
          footer={<Link to="/directory">All {real.length} programs →</Link>}
        />
      </section>

      <section className="wrap pad-bottom">
        <div className="cta-band">
          <div>
            <h2>Only 11.5% of eligible LFPP applicants were funded in FY2025.</h2>
          </div>
          <Link to="/directory" className="btn light">Open the directory</Link>
        </div>
      </section>
    </>
  )
}
