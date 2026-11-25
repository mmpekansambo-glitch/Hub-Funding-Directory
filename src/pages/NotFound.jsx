import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="wrap pad narrow">
      <h1 className="page-title">Page not found</h1>
      <p className="muted">That page doesn't exist, or the program has moved.</p>
      <Link to="/programs" className="btn">Browse programs</Link>
    </div>
  )
}
