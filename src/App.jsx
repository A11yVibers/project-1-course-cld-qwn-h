import { useEffect } from 'react'
import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import SiteHeader from './components/SiteHeader.jsx'
import CatalogPage from './pages/CatalogPage.jsx'
import CoursePage from './pages/CoursePage.jsx'

const BASE_TITLE = 'Meridian · Online History Learning'

function ScrollAndTitle() {
  const { pathname } = useLocation()
  useEffect(() => {
    document.title = BASE_TITLE
  }, [pathname])
  return null
}

export default function App() {
  return (
    <HashRouter>
      <ScrollAndTitle />
      <div className="app-shell">
        <SiteHeader />
        <Routes>
          <Route path="/" element={<CatalogPage />} />
          <Route path="/course/:courseId" element={<CoursePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </HashRouter>
  )
}
