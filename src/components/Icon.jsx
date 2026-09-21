// Small inline stroke-icon set (24×24, currentColor). Pure markup — no image
// files are created or embedded.
const PATHS = {
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.5" y2="16.5" />
    </>
  ),
  close: (
    <>
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </>
  ),
  chevronLeft: <polyline points="14 6 8 12 14 18" />,
  chevronRight: <polyline points="10 6 16 12 10 18" />,
  chevronDown: <polyline points="6 10 12 16 18 10" />,
  arrowLeft: (
    <>
      <line x1="20" y1="12" x2="4" y2="12" />
      <polyline points="10 6 4 12 10 18" />
    </>
  ),
  arrowRight: (
    <>
      <line x1="4" y1="12" x2="20" y2="12" />
      <polyline points="14 6 20 12 14 18" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <line x1="3.5" y1="10" x2="20.5" y2="10" />
      <line x1="8" y1="2.5" x2="8" y2="6.5" />
      <line x1="16" y1="2.5" x2="16" y2="6.5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <polyline points="12 7 12 12 15.5 14" />
    </>
  ),
  book: (
    <>
      <path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H19a1 1 0 0 1 1 1v13" />
      <path d="M4 4.5V19a2 2 0 0 0 2 2h14" />
      <line x1="8" y1="7.5" x2="16" y2="7.5" />
      <line x1="8" y1="11" x2="13.5" y2="11" />
    </>
  ),
  fileText: (
    <>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <polyline points="14 3 14 8 19 8" />
      <line x1="9" y1="13" x2="15" y2="13" />
      <line x1="9" y1="17" x2="13.5" y2="17" />
    </>
  ),
  play: (
    <>
      <circle cx="12" cy="12" r="9" />
      <polygon points="10 8.5 16 12 10 15.5" fill="currentColor" stroke="none" />
    </>
  ),
  youtube: (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <polygon points="10.5 9.5 15 12 10.5 14.5" fill="currentColor" stroke="none" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 20.5c1.5-3.5 4.2-5 7.5-5s6 1.5 7.5 5" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <polyline points="3.5 6.5 12 13 20.5 6.5" />
    </>
  ),
  panelLeft: (
    <>
      <rect x="3" y="4.5" width="18" height="15" rx="2" />
      <line x1="10" y1="4.5" x2="10" y2="19.5" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <polygon points="15.5 8.5 10.8 10.8 8.5 15.5 13.2 13.2" />
    </>
  ),
  list: (
    <>
      <line x1="9" y1="6" x2="20" y2="6" />
      <line x1="9" y1="12" x2="20" y2="12" />
      <line x1="9" y1="18" x2="20" y2="18" />
      <circle cx="4.75" cy="6" r="1" fill="currentColor" stroke="none" />
      <circle cx="4.75" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="4.75" cy="18" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  image: (
    <>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
      <circle cx="9" cy="9.5" r="1.75" />
      <path d="M4.5 17l4.5-4.5 3.5 3 3-2.5 4 4" />
    </>
  ),
  external: (
    <>
      <path d="M14 4h6v6" />
      <line x1="20" y1="4" x2="11" y2="13" />
      <path d="M18 14.5V19a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 19V8a1.5 1.5 0 0 1 1.5-1.5H10" />
    </>
  ),
  download: (
    <>
      <line x1="12" y1="3.5" x2="12" y2="15" />
      <polyline points="7 10.5 12 15.5 17 10.5" />
      <line x1="4.5" y1="20" x2="19.5" y2="20" />
    </>
  ),
}

export default function Icon({ name, size = 20, strokeWidth = 1.8, ...rest }) {
  const glyph = PATHS[name]
  if (!glyph) return null
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {glyph}
    </svg>
  )
}
