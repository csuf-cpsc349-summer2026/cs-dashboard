export default function Card({ label, headerRight, className = '', style, children }) {
  return (
    <div
      className={`bg-white border border-gray-200 rounded-xl p-5 overflow-y-auto ${className}`}
      style={style}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
          {label}
        </span>
        {headerRight}
      </div>
      {children}
    </div>
  )
}
