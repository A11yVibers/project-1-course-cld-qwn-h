/** Inline SVG icon set (code-drawn, no image assets). */

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

function Svg({ size = 18, children, ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      {...base}
      {...rest}
    >
      {children}
    </svg>
  )
}

export function IconSearch({ size }) {
  return (
    <Svg size={size}>
      <circle cx="11" cy="11" r="7" />
      <line x1="16.5" y1="16.5" x2="21" y2="21" />
    </Svg>
  )
}

export function IconChevron({ size, direction = 'left' }) {
  const rotation = { left: 0, down: -90, up: 90, right: 180 }[direction] ?? 0
  return (
    <Svg size={size}>
      <polyline points="14.5 5 8 12 14.5 19" transform={`rotate(${rotation} 12 12)`} />
    </Svg>
  )
}

export function IconClose({ size }) {
  return (
    <Svg size={size}>
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </Svg>
  )
}

export function IconExternal({ size }) {
  return (
    <Svg size={size}>
      <path d="M14 4h6v6" />
      <path d="M20 4 11 13" />
      <path d="M18 14v5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 19V8a1.5 1.5 0 0 1 1.5-1.5H10" />
    </Svg>
  )
}

export function IconPanelCollapse({ size }) {
  return (
    <Svg size={size}>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
      <line x1="9.5" y1="4.5" x2="9.5" y2="19.5" />
      <polyline points="15 10 13 12 15 14" />
    </Svg>
  )
}

export function IconCalendar({ size }) {
  return (
    <Svg size={size}>
      <rect x="3.5" y="5" width="17" height="15" rx="2" />
      <line x1="3.5" y1="10" x2="20.5" y2="10" />
      <line x1="8" y1="3" x2="8" y2="6.5" />
      <line x1="16" y1="3" x2="16" y2="6.5" />
    </Svg>
  )
}

export function IconLayers({ size }) {
  return (
    <Svg size={size}>
      <polygon points="12 3 21 8 12 13 3 8" />
      <polyline points="3 13 12 18 21 13" />
    </Svg>
  )
}

export function IconUsers({ size }) {
  return (
    <Svg size={size}>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M3 20c.8-3.2 3.2-5 6-5s5.2 1.8 6 5" />
      <circle cx="17.5" cy="9.5" r="2.5" />
      <path d="M16 15.2c2.6.2 4.4 1.8 5 4.8" />
    </Svg>
  )
}

export function IconScroll({ size }) {
  return (
    <Svg size={size}>
      <path d="M7 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7" />
      <path d="M7 4a2 2 0 0 0-2 2v1h3" />
      <path d="M7 20a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2" />
      <line x1="12" y1="9" x2="17" y2="9" />
      <line x1="12" y1="13" x2="17" y2="13" />
    </Svg>
  )
}

/** Material type icons */
export function IconDoc({ size }) {
  return (
    <Svg size={size}>
      <path d="M6 3.5h8L19 8.5V20a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z" />
      <polyline points="13.5 3.5 13.5 9 19 9" />
      <line x1="8.5" y1="13" x2="15.5" y2="13" />
      <line x1="8.5" y1="16.5" x2="15.5" y2="16.5" />
    </Svg>
  )
}

export function IconPlay({ size }) {
  return (
    <Svg size={size}>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <polygon points="10.5 9.5 15.5 12 10.5 14.5" fill="currentColor" stroke="none" />
    </Svg>
  )
}

export function IconYouTube({ size }) {
  return (
    <Svg size={size}>
      <rect x="2.5" y="6" width="19" height="12" rx="3.5" />
      <polygon points="10.5 9.5 15 12 10.5 14.5" fill="currentColor" stroke="none" />
    </Svg>
  )
}

export function IconAssignment({ size }) {
  return (
    <Svg size={size}>
      <rect x="5" y="4.5" width="14" height="16.5" rx="2" />
      <path d="M9 4.5V3h6v1.5" />
      <line x1="9" y1="10" x2="15" y2="10" />
      <line x1="9" y1="13.5" x2="15" y2="13.5" />
      <line x1="9" y1="17" x2="12.5" y2="17" />
    </Svg>
  )
}

export function MaterialIcon({ type, size = 16 }) {
  switch (type) {
    case 'pdf':
      return <IconDoc size={size} />
    case 'video':
      return <IconPlay size={size} />
    case 'youtube':
      return <IconYouTube size={size} />
    case 'md':
      return <IconAssignment size={size} />
    default:
      return <IconDoc size={size} />
  }
}

/** Agora logomark: a simple temple pediment over columns. */
export function LogoMark({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2.8 8.4 12 3l9.2 5.4" />
        <line x1="4.6" y1="8.4" x2="19.4" y2="8.4" />
        <line x1="6.6" y1="10.8" x2="6.6" y2="17" />
        <line x1="12" y1="10.8" x2="12" y2="17" />
        <line x1="17.4" y1="10.8" x2="17.4" y2="17" />
        <line x1="4" y1="19.8" x2="20" y2="19.8" />
      </g>
    </svg>
  )
}
