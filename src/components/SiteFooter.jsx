import { catalogStats } from '../data/catalog.js'
import { BrandMark } from './SiteHeader.jsx'

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <BrandMark size={26} />
          <div>
            <p className="site-footer__name">Chronicle</p>
            <p className="site-footer__note">
              An online school devoted entirely to history — {catalogStats.courseCount} courses,{' '}
              {catalogStats.classCount} class sessions, {catalogStats.instructorCount} instructors.
            </p>
          </div>
        </div>
        <p className="site-footer__note">
          Course imagery via Wikimedia Commons. Instructor portraits via randomuser.me. All course,
          class, and material data from the supplied platform datasets.
        </p>
      </div>
    </footer>
  )
}
