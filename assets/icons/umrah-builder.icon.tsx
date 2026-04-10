export default function UmrahBuilderIcon({ className }: { className?: string }) {
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
      <rect x="7" y="8" width="10" height="10" rx="1" />
      <rect x="10" y="13" width="4" height="5" />
      <line x1="7" y1="11" x2="17" y2="11" />
      <rect x="3" y="3" width="4" height="3" rx="0.5" />
      <rect x="17" y="3" width="4" height="3" rx="0.5" />
      <path d="M5 6v2h2" />
      <path d="M19 6v2h-2" />
    </svg>
  )
}