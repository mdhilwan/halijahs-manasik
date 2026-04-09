export default function CollapseIcon({ isCollapsed }: { isCollapsed: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  )
}