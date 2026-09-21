import SiteHeader from './components/SiteHeader.jsx'
import SiteFooter from './components/SiteFooter.jsx'
import CatalogPage from './components/CatalogPage.jsx'
import CoursePage from './components/CoursePage.jsx'
import Icon from './components/Icon.jsx'
import { useHashRoute } from './router.js'
import { getCourse, catalogStats } from './data/catalog.js'

function ErrorPage({ title, message }) {
  return (
    <main id="main" tabIndex={-1} className="page page--error">
      <div className="error-panel card">
        <p className="error-panel__code">404</p>
        <h1 className="error-panel__title">{title}</h1>
        <p className="error-panel__text">{message}</p>
        <a className="hero__cta hero__cta--inline" href="#/">
          Return to the catalog <Icon name="arrowRight" size={17} />
        </a>
      </div>
    </main>
  )
}

export default function App() {
  const [route] = useHashRoute()

  let body
  if (route.name === 'catalog') {
    body = (
      <main id="main" tabIndex={-1}>
        <CatalogPage />
      </main>
    )
  } else if (route.name === 'course') {
    const course = getCourse(route.courseId)
    body = course ? (
      <main id="main" tabIndex={-1}>
        {/* key resets pane/viewer state when switching courses */}
        <CoursePage key={course.id} course={course} />
      </main>
    ) : (
      <ErrorPage
        title="Course not found"
        message="We couldn’t find that course in the catalog. It may have been removed or the link may be out of date."
      />
    )
  } else {
    body = (
      <ErrorPage
        title="This page is lost to history"
        message={`The page you requested doesn’t exist. Head back to the catalog to browse all ${catalogStats.courseCount} history courses.`}
      />
    )
  }

  return (
    <div className="app">
      <a
        className="skip-link"
        href="#main"
        onClick={(e) => {
          // Hash routing owns location.hash, so move focus manually.
          e.preventDefault()
          const main = document.getElementById('main')
          main?.focus()
          main?.scrollIntoView()
        }}
      >
        Skip to main content
      </a>
      <SiteHeader route={route} />
      {body}
      <SiteFooter />
    </div>
  )
}
