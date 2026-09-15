import { useEffect, useState } from 'react'
import { coursesById } from './data.js'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import CatalogPage from './components/CatalogPage.jsx'
import CoursePage from './components/CoursePage.jsx'

const COURSE_ROUTE = /^#\/course\/([A-Za-z0-9-]+)$/

function parseHash(hash) {
  const match = COURSE_ROUTE.exec(hash ?? '')
  if (match && coursesById[match[1]]) {
    return { name: 'course', courseId: match[1] }
  }
  return { name: 'catalog' }
}

export default function App() {
  const [route, setRoute] = useState(() => parseHash(window.location.hash))

  useEffect(() => {
    const onHashChange = () => setRoute(parseHash(window.location.hash))
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const course = route.name === 'course' ? coursesById[route.courseId] : null

  useEffect(() => {
    document.title = course ? `${course.name} · Agora History Academy` : 'Agora · Online History Academy'
    window.scrollTo(0, 0)
  }, [course, route.name])

  return (
    <div className={`app-shell ${course ? 'app-course' : ''}`}>
      <Header course={course} />
      <main className="app-main">
        {course ? <CoursePage course={course} /> : <CatalogPage />}
      </main>
      {!course && <Footer />}
    </div>
  )
}
