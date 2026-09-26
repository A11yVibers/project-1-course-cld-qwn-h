import { Link, useLocation } from 'react-router-dom'
import { CompassIcon, RouteIcon } from './icons.jsx'
import { catalogStats } from '../data/store.js'

export default function SiteHeader() {
  const { pathname } = useLocation()
  const onCatalog = pathname === '/'

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link to="/" className="brand" aria-label="Meridian History — home">
          <span className="brand__mark">
            <CompassIcon size={24} />
          </span>
          <span className="brand__text">
            <span className="brand__name">Meridian</span>
            <span className="brand__tag">History Learning Platform</span>
          </span>
        </Link>

        <nav className="site-nav" aria-label="Primary">
          <Link to="/" className={`site-nav__link${onCatalog ? ' is-active' : ''}`}>
            Course Catalog
          </Link>
          <span className="site-nav__stat">
            <RouteIcon size={15} />
            {catalogStats.courseCount} courses · {catalogStats.classCount} classes
          </span>
        </nav>
      </div>
    </header>
  )
}
