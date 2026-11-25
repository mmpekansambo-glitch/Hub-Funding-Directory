import { useSaved } from '../SavedContext.jsx'

export default function SaveButton({ id, name, label = false }) {
  const { has, toggle } = useSaved()
  const on = has(id)
  return (
    <button
      type="button"
      className={`save-btn${on ? ' on' : ''}${label ? ' labeled' : ''}`}
      aria-pressed={on}
      aria-label={on ? `Remove ${name} from saved` : `Save ${name}`}
      title={on ? 'Saved' : 'Save'}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(id) }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill={on ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
        <path d="M6 3h12v18l-6-4-6 4z" />
      </svg>
      {label && <span>{on ? 'Saved' : 'Save'}</span>}
    </button>
  )
}
