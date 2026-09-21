import { useEffect, useState, useCallback } from 'react'

// Tiny hash-based router: '#/' → catalog, '#/course/HIST111' → course page.
function parseHash(hash) {
  const path = (hash || '').replace(/^#/, '') || '/'
  const courseMatch = path.match(/^\/course\/([\w-]+)\/?$/)
  if (courseMatch) return { name: 'course', courseId: courseMatch[1] }
  if (path === '/' || path === '') return { name: 'catalog' }
  return { name: 'notfound' }
}

export function useHashRoute() {
  const [route, setRoute] = useState(() => parseHash(window.location.hash))

  useEffect(() => {
    const onChange = () => {
      setRoute(parseHash(window.location.hash))
      window.scrollTo({ top: 0 })
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  const navigate = useCallback((to) => {
    window.location.hash = to
  }, [])

  return [route, navigate]
}

export function coursePath(courseId) {
  return `#/course/${courseId}`
}
