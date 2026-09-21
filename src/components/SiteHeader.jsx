import { catalogStats } from '../data/catalog.js'

export function BrandMark({ size = 30 }) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      className="brand-mark"
    >
      <circle cx="16" cy="16" r="14.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M5.5 18.5c3.5-6 7-6 10.5 0s7 6 10.5 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="9.5" cy="13.5" r="1.6" fill="currentColor" />
      <circle cx="16" cy="18.5" r="1.6" fill="currentColor" />
      <circle cx="22.5" cy="13.5" r="1.6" fill="currentColor" />
    </svg>
  )
}

export default function SiteHeader({ route }) {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a className="brand" href="#/">
          <BrandMark />
          <span className="brand__text">
            <span className="brand__name">Chronicle</span>
            <span className="brand__tagline">Online School of History</span>
          </span>
        </a>
        <nav className="site-nav" aria-label="Main">
          <a
            className={route.name === 'catalog' ? 'site-nav__link is-active' : 'site-nav__link'}
            href="#/"
            aria-current={route.name === 'catalog' ? 'page' : undefined}
          >
            Course Catalog
          </a>
          <span className="site-nav__meta">
            {catalogStats.courseCount} courses · {catalogStats.instructorCount} instructors
            {catalogStats.termLabel ? ` · ${catalogStats.termLabel}` : ''}
          </span>
        </nav>
      </div>
    </header>
  )
}
