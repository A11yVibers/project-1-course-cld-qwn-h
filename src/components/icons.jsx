// Small inline SVG icon set used across the UI (code, not image files).

function Svg({ size = 16, children, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  )
}

export function CompassIcon({ size = 22, ...props }) {
  return (
    <Svg size={size} {...props}>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M15.6 8.4 13.8 13.8 8.4 15.6l1.8-5.4 5.4-1.8Z" />
      <path d="M12 2.5v1.6M12 19.9v1.6M2.5 12h1.6M19.9 12h1.6" strokeWidth="1.4" />
    </Svg>
  )
}

export function SearchIcon({ size = 16, ...props }) {
  return (
    <Svg size={size} {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.8-3.8" />
    </Svg>
  )
}

export function ChevronLeftIcon({ size = 16, ...props }) {
  return (
    <Svg size={size} {...props}>
      <path d="m14.5 5-7 7 7 7" />
    </Svg>
  )
}

export function ChevronRightIcon({ size = 16, ...props }) {
  return (
    <Svg size={size} {...props}>
      <path d="m9.5 5 7 7-7 7" />
    </Svg>
  )
}

export function ArrowLeftIcon({ size = 16, ...props }) {
  return (
    <Svg size={size} {...props}>
      <path d="M19 12H5" />
      <path d="m11 6-6 6 6 6" />
    </Svg>
  )
}

export function CloseIcon({ size = 16, ...props }) {
  return (
    <Svg size={size} {...props}>
      <path d="m6 6 12 12M18 6 6 18" />
    </Svg>
  )
}

export function FileTextIcon({ size = 16, ...props }) {
  return (
    <Svg size={size} {...props}>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6M9 17h6" />
    </Svg>
  )
}

export function PlayCircleIcon({ size = 16, ...props }) {
  return (
    <Svg size={size} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m10 8.5 6 3.5-6 3.5v-7Z" />
    </Svg>
  )
}

export function MarkdownIcon({ size = 16, ...props }) {
  return (
    <Svg size={size} {...props}>
      <rect x="2.5" y="5" width="19" height="14" rx="2" />
      <path d="M6 15.5v-7l3 3.5 3-3.5v7" />
      <path d="M16.5 8.5v7M16.5 15.5 14.75 13M16.5 15.5 18.25 13" strokeWidth="1.4" />
    </Svg>
  )
}

export function CalendarIcon({ size = 16, ...props }) {
  return (
    <Svg size={size} {...props}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </Svg>
  )
}

export function LayersIcon({ size = 16, ...props }) {
  return (
    <Svg size={size} {...props}>
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3.8 12.4 8.2 4.6 8.2-4.6" />
      <path d="m3.8 16.6 8.2 4.6 8.2-4.6" strokeWidth="1.2" />
    </Svg>
  )
}

export function MailIcon({ size = 16, ...props }) {
  return (
    <Svg size={size} {...props}>
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="m3.8 7 8.2 6 8.2-6" />
    </Svg>
  )
}

export function ExternalLinkIcon({ size = 16, ...props }) {
  return (
    <Svg size={size} {...props}>
      <path d="M14 4h6v6" />
      <path d="M20 4 11 13" />
      <path d="M18 14.5V19a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 19V8a1.5 1.5 0 0 1 1.5-1.5H10" />
    </Svg>
  )
}

export function ImageIcon({ size = 16, ...props }) {
  return (
    <Svg size={size} {...props}>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
      <circle cx="9" cy="10" r="1.6" />
      <path d="m4.5 17.5 4.7-4.4a1.6 1.6 0 0 1 2.2 0l3.1 3m0 0 2-1.8a1.6 1.6 0 0 1 2.2 0l1.8 1.7" />
    </Svg>
  )
}

export function RouteIcon({ size = 16, ...props }) {
  return (
    <Svg size={size} {...props}>
      <circle cx="6" cy="18" r="2.6" />
      <circle cx="18" cy="6" r="2.6" />
      <path d="M8.6 18h4.9a3.5 3.5 0 0 0 0-7h-3a3.5 3.5 0 0 1 0-7h4.9" strokeDasharray="0.5 2.6" />
    </Svg>
  )
}

export function PanelCollapseIcon({ size = 16, ...props }) {
  return (
    <Svg size={size} {...props}>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
      <path d="M10 4.5v15" />
      <path d="m6.8 9.8-2 2.2 2 2.2" strokeWidth="1.4" />
    </Svg>
  )
}

export function materialTypeIcon(type) {
  switch (type) {
    case 'video':
    case 'youtube':
      return PlayCircleIcon
    case 'md':
      return MarkdownIcon
    case 'pdf':
    default:
      return FileTextIcon
  }
}
