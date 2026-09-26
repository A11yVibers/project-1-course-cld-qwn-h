import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  courses,
  instructors,
  catalogStats,
} from '../data/store.js'
import {
  SearchIcon,
  CloseIcon,
  CalendarIcon,
  LayersIcon,
  ChevronRightIcon,
} from '../components/icons.jsx'

const SORT_OPTIONS = [
  { value: 'number', label: 'Course number' },
  { value: 'az', label: 'Title A–Z' },
  { value: 'short', label: 'Shortest first' },
  { value: 'long', label: 'Longest first' },
]

function CourseCard({ course }) {
  return (
    <Link to={`/course/${course.id}`} className="course-card" aria-label={`Open course: ${course.name}`}>
      <div className="course-card__media">
        <img src={course.imageUrl} alt="" loading="lazy" />
        <span className="course-card__code">{course.id}</span>
      </div>
      <div className="course-card__body">
        <h3 className="course-card__title">{course.name}</h3>
        <p className="course-card__desc">{course.shortDescription}</p>
        <div className="course-card__meta">
          {course.instructor && (
            <span className="instructor-pill">
              <img src={course.instructor.photoUrl} alt="" className="instructor-pill__photo" />
              {course.instructor.name}
            </span>
          )}
          <span className="meta-stat">
            <LayersIcon size={14} /> {course.numberOfClasses} classes
          </span>
          <span className="meta-stat">
            <CalendarIcon size={14} /> {course.numberOfWeeks} weeks
          </span>
        </div>
      </div>
      <span className="course-card__cta">
        View course <ChevronRightIcon size={14} />
      </span>
    </Link>
  )
}

export default function CatalogPage() {
  const [query, setQuery] = useState('')
  const [instructorId, setInstructorId] = useState('all')
  const [duration, setDuration] = useState('all')
  const [sort, setSort] = useState('number')

  useEffect(() => {
    document.title = 'Course Catalog · Meridian History'
  }, [])

  const durations = useMemo(() => {
    const weeks = [...new Set(courses.map((c) => c.numberOfWeeks))].sort((a, b) => a - b)
    return weeks.map((w) => ({ value: String(w), label: `${w} weeks` }))
  }, [])

  const visibleCourses = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = courses.filter((course) => {
      if (instructorId !== 'all' && course.instructor?.id !== instructorId) return false
      if (duration !== 'all' && String(course.numberOfWeeks) !== duration) return false
      if (!q) return true
      const haystack = [
        course.id,
        course.name,
        course.shortDescription,
        course.longDescription,
        course.instructor?.name,
        ...course.classes.map((cls) => cls.name),
      ]
        .filter(Boolean)
        .join(' \n ')
        .toLowerCase()
      return haystack.includes(q)
    })

    list = [...list]
    switch (sort) {
      case 'az':
        list.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'short':
        list.sort((a, b) => a.numberOfWeeks - b.numberOfWeeks || a.id.localeCompare(b.id))
        break
      case 'long':
        list.sort((a, b) => b.numberOfWeeks - a.numberOfWeeks || a.id.localeCompare(b.id))
        break
      default:
        list.sort((a, b) => a.id.localeCompare(b.id))
    }
    return list
  }, [query, instructorId, duration, sort])

  const filtersActive = query.trim() !== '' || instructorId !== 'all' || duration !== 'all'

  function clearFilters() {
    setQuery('')
    setInstructorId('all')
    setDuration('all')
  }

  return (
    <main className="catalog-page">
      <section className="catalog-hero">
        <p className="catalog-hero__eyebrow">
          <span className="hero-rule" aria-hidden="true" />
          Fall 2026 · Fully online
        </p>
        <h1 className="catalog-hero__title">
          Study the past, <em>one journey at a time</em>
        </h1>
        <p className="catalog-hero__lede">
          From the banks of the Nile to the caravanserais of the Silk Roads — explore{' '}
          {catalogStats.courseCount} instructor-led history courses with weekly seminars,
          lecture materials, readings, and hands-on assignments.
        </p>
        <dl className="catalog-hero__stats">
          <div>
            <dt>Courses</dt>
            <dd>{catalogStats.courseCount}</dd>
          </div>
          <div>
            <dt>Classes</dt>
            <dd>{catalogStats.classCount}</dd>
          </div>
          <div>
            <dt>Historians</dt>
            <dd>{catalogStats.instructorCount}</dd>
          </div>
          <div>
            <dt>Eras spanned</dt>
            <dd>5,000 yrs</dd>
          </div>
        </dl>
      </section>

      <section className="catalog-toolbar" aria-label="Search and filter courses">
        <div className="search-field">
          <SearchIcon size={17} />
          <input
            type="search"
            value={query}
            placeholder="Search courses, topics, or instructors…"
            aria-label="Search courses"
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button type="button" className="search-field__clear" onClick={() => setQuery('')} aria-label="Clear search">
              <CloseIcon size={14} />
            </button>
          )}
        </div>

        <div className="toolbar-controls">
          <div className="filter-select">
            <label htmlFor="filter-duration">Duration</label>
            <select id="filter-duration" value={duration} onChange={(e) => setDuration(e.target.value)}>
              <option value="all">Any length</option>
              {durations.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-select">
            <label htmlFor="filter-sort">Sort by</label>
            <select id="filter-sort" value={sort} onChange={(e) => setSort(e.target.value)}>
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <div className="instructor-chips" role="group" aria-label="Filter by instructor">
        <button
          type="button"
          className={`chip${instructorId === 'all' ? ' is-active' : ''}`}
          onClick={() => setInstructorId('all')}
        >
          All instructors
        </button>
        {instructors.map((person) => (
          <button
            key={person.id}
            type="button"
            className={`chip${instructorId === person.id ? ' is-active' : ''}`}
            onClick={() => setInstructorId(person.id)}
          >
            <img src={person.photoUrl} alt="" className="chip__photo" />
            {person.name}
          </button>
        ))}
      </div>

      <p className="catalog-count" aria-live="polite">
        Showing <strong>{visibleCourses.length}</strong> of {courses.length} courses
        {filtersActive && (
          <button type="button" className="link-button" onClick={clearFilters}>
            Clear filters
          </button>
        )}
      </p>

      {visibleCourses.length > 0 ? (
        <div className="course-grid">
          {visibleCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>No courses match your search</h2>
          <p>Try a different keyword — for example “Rome”, “silk”, or “revolution”.</p>
          <button type="button" className="button button--primary" onClick={clearFilters}>
            Clear all filters
          </button>
        </div>
      )}
    </main>
  )
}
