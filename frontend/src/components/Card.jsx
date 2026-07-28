export default function Card({ label, headerRight, className = '', style, children, scrollable = true }) {
  return (
    <div
      className={`border rounded-xl p-5 flex flex-col min-h-0 ${className}`}
      style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', ...style }}
    >
      <div className="flex items-center justify-between flex-shrink-0">
        <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
          {label}
        </span>
        {headerRight}
      </div>
      <div
        className={`flex-1 min-h-0 flex flex-col ${scrollable ? 'overflow-y-auto' : 'overflow-hidden'}`}
        style={{ containerType: scrollable ? 'inline-size' : 'size' }}
      >
        {children}
      </div>
    </div>
  )
}
