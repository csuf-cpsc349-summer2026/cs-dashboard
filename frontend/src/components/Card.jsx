export default function Card({ label, headerRight, className = '', style, children, scrollable = true }) {
  return (
    <div
      className={`bg-white border border-gray-200 rounded-xl p-5 flex flex-col min-h-0 ${className}`}
      style={style}
    >
      <div className="flex items-center justify-between flex-shrink-0">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
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
