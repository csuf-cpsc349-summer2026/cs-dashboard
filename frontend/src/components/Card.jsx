export default function Card({ label, headerRight, className = '', style, children }) {
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
      <div className="flex-1 min-h-0 overflow-y-auto flex flex-col">
        {children}
      </div>
    </div>
  )
}
