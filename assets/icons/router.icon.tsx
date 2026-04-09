export default function RouterIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="14" width="20" height="8" rx="2" ry="2"/>
      <path d="M6 22V14a2 2 0 012-2h8a2 2 0 012 2v8"/>
      <path d="M6 14V2h4v4h4V2h4v12"/>
      <circle cx="6" cy="18" r="1"/>
      <circle cx="18" cy="18" r="1"/>
    </svg>
  )
}