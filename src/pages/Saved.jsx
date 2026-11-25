import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useData } from '../DataContext.jsx'
import { useSaved } from '../SavedContext.jsx'
import ProgramTable from '../components/ProgramTable.jsx'
import { where } from '../components/ProgramCard.jsx'
import { downloadXlsx, downloadPdf } from '../export.js'

export default function Saved() {
  const { data } = useData()
  const { ids, clear } = useSaved()
  const [busy, setBusy] = useState('')
  const programs = ids.map((id) => data.programs.find((p) => p.id === id)).filter(Boolean)

  const run = async (kind) => {
    setBusy(kind)
    try {
      await (kind === 'xlsx' ? downloadXlsx : downloadPdf)(programs, where)
    } catch (e) {
      console.error(e)
      alert('Download failed. Please try again.')
    } finally {
      setBusy('')
    }
  }

  return (
    <div className="wrap pad">
      <div className="row-head">
        <h1 className="page-title">Saved</h1>
        {programs.length > 0 && (
          <div className="actions">
            <button className="btn" onClick={() => run('xlsx')} disabled={!!busy}>{busy === 'xlsx' ? 'Preparing…' : 'Download Excel'}</button>
            <button className="btn" onClick={() => run('pdf')} disabled={!!busy}>{busy === 'pdf' ? 'Preparing…' : 'Download PDF'}</button>
            <button className="btn ghost" onClick={clear}>Clear</button>
          </div>
        )}
      </div>
      {programs.length ? (
        <ProgramTable title={`${programs.length} saved`} programs={programs} />
      ) : (
        <div className="empty">
          <p>Nothing saved yet.</p>
          <Link to="/directory" className="btn">Open the directory</Link>
        </div>
      )}
    </div>
  )
}
