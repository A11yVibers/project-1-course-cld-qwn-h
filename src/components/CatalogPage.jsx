import { useMemo, useState } from 'react'
import { courses, instructors, platformStats, coursesWithMaterials } from '../data.js'
import { CourseImage, InstructorAvatar } from './Images.jsx'
import { IconSearch, IconCalendar, IconLayers, IconUsers, IconChevron } from './icons.jsx'

const DURATIONS = [
  { value: 'all', label: 'Any length', test: () => true },
  { value: 'short', label: 'Short · 5 weeks', test: (course) => course.numberOfWeeks <= 5 },
  { value: 'medium', label: 'Medium · 6 weeks', test: (course) => course.numberOfWeeks === 6 },
  { value: 'long', label: 'Long · 7+ weeks', test: (course) => course.numberOfWeeks >= 7 },
]

const SORTS = [
  { value: 'era', label: 'Era order' },
  { value: 'title', label: 'Title A–Z' },
  { value: 'shortest', label: 'Shortest first' },
  { value: 'longest', label: 'Longest first' },
]

function matchesQuery(course, query) {
  if (!query) return true
  const haystack = [
    course.id,
    course.name,
    course.shortDescription,
    course.longDescription,
    course.instructor?.name ?? '',
    ...course.classes.map((cls) => cls.name),
  ]
    .join(' ')
    .toLowerCase()
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => haystack.includes(term))
}

function CourseCard({ course }) {
  return (
    <a className="course-card" href={`#/course/${course.id}`}>
      <div className="card-media">
        <CourseImage
          src={course.imageUrl}
          alt={course.name}
          label={course.id}
          className="card-image"
        />
        <span className="card-code">{course.id}</span>
        {course.materialCount > 0 && <span className="card-flag">Materials live</span>}
      </div>
      <div className="card-body">
        <h3 className="card-title">{course.name}</h3>
        <p className="card-description">{course.shortDescription}</p>
      </div>
      <div className="card-footer">
        <span className="card-instructor">
          <InstructorAvatar instructor={course.instructor} size={28} />
          {course.instructor?.name ?? 'Faculty TBA'}
        </span>
        <span className="card-meta">
          {course.numberOfClasses} classes · {course.numberOfWeeks} wks
        </span>
      </div>
    </a>
  )
}

export default function CatalogPage() {
  const [query, setQuery] = useState('')
  const [instructorId, setInstructorId] = useState('all')
  const [duration, setDuration] = useState('all')
  const [sort, setSort] = useState('era')

  const visibleCourses = useMemo(() => {
    const durationFilter = DURATIONS.find((option) => option.value === duration) ?? DURATIONS[0]
    const filtered = courses.filter(
      (course) =>
        matchesQuery(course, query.trim()) &&
        (instructorId === 'all' || course.instructorId === instructorId) &&
        durationFilter.test(course),
    )
    const sorted = [...filtered]
    switch (sort) {
      case 'title':
        sorted.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'shortest':
        sorted.sort((a, b) => a.numberOfWeeks - b.numberOfWeeks || a.id.localeCompare(b.id))
        break
      case 'longest':
        sorted.sort((a, b) => b.numberOfWeeks - a.numberOfWeeks || a.id.localeCompare(b.id))
        break
      default:
        sorted.sort((a, b) => a.id.localeCompare(b.id))
    }
    return sorted
  }, [query, instructorId, duration, sort])

  const featured = coursesWithMaterials[0] ?? null
  const filtersActive = query.trim() !== '' || instructorId !== 'all' || duration !== 'all'

  return (
    <>
      <section className="hero">
        <div className="hero-inner">
          <p className="eyebrow">Online history academy</p>
          <h1 className="hero-title">
            From the banks of the Nile
            <br />
            to the caravans of the Silk Roads.
          </h1>
          <p className="hero-sub">
            Instructor-led courses across the ancient, medieval, and modern worlds — each with a
            complete syllabus, lecture materials, readings, and assignments you can study right
            inside the course page.
          </p>
          <ul className="hero-stats">
            <li>
              <IconLayers size={18} />
              <strong>{platformStats.courseCount}</strong>
              <span>courses</span>
            </li>
            <li>
              <IconCalendar size={18} />
              <strong>{platformStats.classCount}</strong>
              <span>classes</span>
            </li>
            <li>
              <IconUsers size={18} />
              <strong>{platformStats.instructorCount}</strong>
              <span>historians</span>
            </li>
          </ul>

          {featured && (
            <a className="featured-banner" href={`#/course/${featured.id}`}>
              <CourseImage
                src={featured.imageUrl}
                alt={featured.name}
                label={featured.id}
                className="featured-image"
              />
              <span className="featured-copy">
                <span className="featured-eyebrow">Featured course · fully resourced</span>
                <strong className="featured-title">{featured.name}</strong>
                <span className="featured-sub">{featured.shortDescription}</span>
                <span className="featured-cta">
                  Enter the course <IconChevron size={14} direction="right" />
                </span>
              </span>
            </a>
          )}
        </div>
      </section>

      <section className="catalog" id="catalog">
        <div className="catalog-inner">
          <div className="catalog-toolbar">
            <label className="search-field">
              <IconSearch size={17} />
              <input
                type="search"
                value={query}
                placeholder="Search courses, topics, or instructors…"
                onChange={(event) => setQuery(event.target.value)}
                aria-label="Search courses"
              />
            </label>

            <select
              className="select-field"
              value={instructorId}
              onChange={(event) => setInstructorId(event.target.value)}
              aria-label="Filter by instructor"
            >
              <option value="all">All instructors</option>
              {Object.values(instructors).map((instructor) => (
                <option key={instructor.id} value={instructor.id}>
                  {instructor.name}
                </option>
              ))}
            </select>

            <select
              className="select-field"
              value={duration}
              onChange={(event) => setDuration(event.target.value)}
              aria-label="Filter by course length"
            >
              {DURATIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              className="select-field"
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              aria-label="Sort courses"
            >
              {SORTS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="catalog-meta">
            <p className="result-count">
              Showing <strong>{visibleCourses.length}</strong> of {courses.length} courses
              {query.trim() && (
                <>
                  {' '}for “<em>{query.trim()}</em>”
                </>
              )}
            </p>
            {filtersActive && (
              <button
                type="button"
                className="ghost-button"
                onClick={() => {
                  setQuery('')
                  setInstructorId('all')
                  setDuration('all')
                }}
              >
                Clear filters
              </button>
            )}
          </div>

          {visibleCourses.length > 0 ? (
            <div className="course-grid">
              {visibleCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>No courses match your search.</h3>
              <p>Try a different keyword, or clear the filters to see all twelve courses.</p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
