/** Display metadata and small helpers for course materials. */

const TYPE_META = {
  pdf: { label: 'PDF', badgeClass: 'badge-pdf', verb: 'Read' },
  video: { label: 'Video', badgeClass: 'badge-video', verb: 'Watch' },
  youtube: { label: 'YouTube', badgeClass: 'badge-youtube', verb: 'Watch' },
  md: { label: 'Markdown', badgeClass: 'badge-md', verb: 'View' },
}

const FALLBACK_META = { label: 'Resource', badgeClass: 'badge-other', verb: 'Open' }

export function materialTypeMeta(type) {
  return TYPE_META[type] ?? FALLBACK_META
}

/** Convert any common YouTube watch URL into an embeddable URL. */
export function toYouTubeEmbed(url) {
  try {
    const parsed = new URL(url)
    const host = parsed.hostname.replace(/^www\./, '')
    if (host === 'youtu.be') {
      const id = parsed.pathname.replace(/^\//, '')
      return id ? `https://www.youtube.com/embed/${id}` : url
    }
    if (host.endsWith('youtube.com')) {
      const watchId = parsed.searchParams.get('v')
      if (watchId) return `https://www.youtube.com/embed/${watchId}`
      if (parsed.pathname.startsWith('/embed/')) return url
      if (parsed.pathname.startsWith('/watch')) return url
    }
  } catch {
    // fall through and return the original value
  }
  return url
}

const DATE_FORMAT = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

/** Format an ISO date (2026-09-21) as e.g. "Mon, Sep 21, 2026". */
export function formatDate(isoDate) {
  if (!isoDate) return ''
  const date = new Date(`${isoDate}T00:00:00`)
  if (Number.isNaN(date.getTime())) return isoDate
  return DATE_FORMAT.format(date)
}

/** Initials for avatar fallbacks: "Dr. Leila Rahman" -> "LR". */
export function initials(name) {
  return (
    String(name ?? '')
      .split(/\s+/)
      .filter((part) => /^[A-Za-zÀ-ÿ]/.test(part) && !/^(dr|prof|mr|ms|mrs)\.?$/i.test(part))
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join('') || '?'
  )
}
