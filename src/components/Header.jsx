import { LogoMark, IconChevron } from './icons.jsx'
import { platformStats } from '../data.js'

export default function Header({ course }) {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <a className="brand" href="#/">
          <span className="brand-mark">
            <LogoMark size={24} />
          </span>
          <span className="brand-text">
            <strong>Agora</strong>
            <small>History Academy</small>
          </span>
        </a>

        <nav className="site-nav" aria-label="Breadcrumb">
          {course ? (
            <>
              <a className="nav-link" href="#/">
                <IconChevron size={14} direction="left" />
                Course catalog
              </a>
              <span className="nav-separator" aria-hidden="true">/</span>
              <span className="nav-current">{course.id}</span>
            </>
          ) : (
            <span className="nav-pill">
              {platformStats.courseCount} courses · {platformStats.classCount} classes
            </span>
          )}
        </nav>
      </div>
    </header>
  )
}
