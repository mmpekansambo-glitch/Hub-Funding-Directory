import { Link } from 'react-router-dom'

export default function About() {
  return (
    <div className="wrap pad narrow prose">
      <p className="kicker">About</p>
      <h1 className="page-title">Why this directory exists</h1>
      <p className="lede dark">
        Food hubs sit in the missing middle between farms and the people who buy their food. They are hard to
        fund, and the funding that exists is scattered across federal agencies, state departments, CDFIs and
        foundations.
      </p>
      <p>
        The Funding Directory started as a student project studying how regional food hubs survive. The hub
        operators we interviewed kept telling us the same thing: finding the right grant, knowing whether they qualify, and deciding
        between a grant and their own revenue takes time a small hub doesn't have.
      </p>
      <p>
        So we gathered every program we could find into one place, sorted by the stage a hub is at, and checked
        each state and DC for what it offers. This site is the next step: a living version of that research.
      </p>
      <h2>How to use it</h2>
      <ul>
        <li><strong>Pick your stage</strong>: planning, startup, scaling or mature.</li>
        <li><strong>Pick your state</strong> to see local programs next to national ones.</li>
        <li><strong>Check the timing badge</strong>. "Rolling" programs take applications any time; others open in rounds.</li>
        <li><strong>Confirm with the funder</strong>. Programs change often, and each one shows when we last checked it.</li>
      </ul>
      <h2>Spot something out of date?</h2>
      <p>
        Funding rounds open, close and change every year. If you know about a program we're missing or a detail
        that's changed, we'd love to hear from you.
      </p>
      <Link to="/" className="btn">Browse programs</Link>
    </div>
  )
}
