import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  getCourse,
  formatClassDate,
  materialTypeMeta,
} from '../data/store.js'
import MaterialViewer from '../components/MaterialViewer.jsx'
import {
  ArrowLeftIcon,
  CalendarIcon,
  LayersIcon,
  MailIcon,
  PanelCollapseIcon,
  ChevronRightIcon,
  RouteIcon,
  materialTypeIcon,
} from '../components/icons.jsx'

function SyllabusTable({ classes, selectedMaterialId, onSelectMaterial }) {
  const weekCounts = useMemo(() => {
    const counts = new Map()
    for (const cls of classes) counts.set(cls.weekNumber, (counts.get(cls.weekNumber) || 0) + 1)
    return counts
  }, [classes])

  const seenWeeks = new Set()

  return (
    <table className="syllabus-table">
      <caption className="visually-hidden">
        Course syllabus: week number, class date, and class content with available materials
      </caption>
      <thead>
        <tr>
          <th scope="col">Week</th>
          <th scope="col">Date</th>
          <th scope="col">Class Content</th>
        </tr>
      </thead>
      <tbody>
        {classes.map((cls) => {
          const showWeek = !seenWeeks.has(cls.weekNumber)
          if (showWeek) seenWeeks.add(cls.weekNumber)
          return (
            <tr key={cls.id}>
              {showWeek && (
                <td className="syllabus-week" rowSpan={weekCounts.get(cls.weekNumber)}>
                  <span className="week-badge">W{cls.weekNumber}</span>
                  <span className="week-label">Week {cls.weekNumber}</span>
                </td>
              )}
              <td className="syllabus-date">
                <time dateTime={cls.date}>{formatClassDate(cls.date)}</time>
              </td>
              <td className="syllabus-content">
                <h4 className="syllabus-class-title">{cls.name}</h4>
                {cls.materials.length > 0 ? (
                  <ul className="material-list">
                    {cls.materials.map((material) => {
                      const Icon = materialTypeIcon(material.type)
                      const active = selectedMaterialId === material.id
                      return (
                        <li key={material.id}>
                          <button
                            type="button"
                            className={`material-item${active ? ' is-active' : ''}`}
                            onClick={() => onSelectMaterial(material, cls)}
                            aria-pressed={active}
                          >
                            <span className="material-item__icon">
                              <Icon size={15} />
                            </span>
                            <span className="material-item__title">{material.title}</span>
                            <span className="material-item__type">{materialTypeMeta(material.type).label}</span>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                ) : (
                  <p className="material-list-empty">Materials for this class will be posted before the session.</p>
                )}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default function CoursePage() {
  const { courseId } = useParams()
  const course = getCourse(courseId)

  const [collapsed, setCollapsed] = useState(false)
  const [selection, setSelection] = useState(null)

  // Reset viewer + collapse state when navigating between courses.
  useEffect(() => {
    setSelection(null)
    setCollapsed(false)
  }, [courseId])

  if (!course) {
    return (
      <main className="not-found">
        <h1>Course not found</h1>
        <p>“{courseId}” does not match any course in the catalog.</p>
        <Link to="/" className="button button--primary">
          Back to catalog
        </Link>
      </main>
    )
  }

  const totalMaterials = course.classes.reduce((sum, cls) => sum + cls.materials.length, 0)

  function handleSelectMaterial(material, cls) {
    setSelection({ material, cls })
    // On narrow screens the viewer sits below the syllabus — bring it into view.
    if (window.innerWidth < 980) {
      document.getElementById('material-viewer-region')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <main className={`course-page${collapsed ? ' is-collapsed' : ''}`}>
      <div className="course-layout">
        {/* Collapsible left pane: course information + syllabus */}
        <aside className="course-pane" aria-label="Course information and syllabus">
          {collapsed ? (
            <div className="course-pane__rail">
              <button
                type="button"
                className="rail-button"
                onClick={() => setCollapsed(false)}
                aria-label="Expand course information and syllabus"
              >
                <ChevronRightIcon size={18} />
              </button>
              <Link to="/" className="rail-button" aria-label="Back to course catalog">
                <ArrowLeftIcon size={16} />
              </Link>
              <span className="rail-text">{course.name}</span>
            </div>
          ) : (
            <div className="course-pane__scroll">
              <div className="course-pane__topbar">
                <Link to="/" className="back-link">
                  <ArrowLeftIcon size={15} /> All courses
                </Link>
                <button
                  type="button"
                  className="collapse-button"
                  onClick={() => setCollapsed(true)}
                  aria-expanded={!collapsed}
                  aria-controls="course-pane-region"
                >
                  <PanelCollapseIcon size={15} /> Collapse
                </button>
              </div>

              <div className="course-info">
                <div className="course-info__chips">
                  <span className="chip-static chip-static--code">{course.id}</span>
                  <span className="chip-static">
                    <LayersIcon size={13} /> {course.numberOfClasses} classes
                  </span>
                  <span className="chip-static">
                    <CalendarIcon size={13} /> {course.numberOfWeeks} weeks
                  </span>
                </div>
                <h1 className="course-info__title">{course.name}</h1>
                <p className="course-info__short">{course.shortDescription}</p>

                {course.instructor && (
                  <div className="instructor-card">
                    <img src={course.instructor.photoUrl} alt="" className="instructor-card__photo" />
                    <div className="instructor-card__text">
                      <span className="instructor-card__role">Instructor</span>
                      <strong className="instructor-card__name">{course.instructor.name}</strong>
                      <a className="instructor-card__email" href={`mailto:${course.instructor.email}`}>
                        <MailIcon size={13} /> {course.instructor.email}
                      </a>
                    </div>
                  </div>
                )}

                <div className="course-info__long">
                  <h2>About this course</h2>
                  <p>{course.longDescription}</p>
                </div>
              </div>

              <div className="syllabus-section">
                <div className="syllabus-heading">
                  <h2>
                    <RouteIcon size={17} /> Syllabus
                  </h2>
                  <span className="syllabus-heading__note">
                    {course.classes.length} sessions
                    {totalMaterials > 0 && ` · ${totalMaterials} material${totalMaterials === 1 ? '' : 's'}`}
                  </span>
                </div>
                <SyllabusTable
                  classes={course.classes}
                  selectedMaterialId={selection?.material.id ?? null}
                  onSelectMaterial={handleSelectMaterial}
                />
              </div>
            </div>
          )}
        </aside>

        {/* Persistent right pane: course image by default, selected material on demand */}
        <div className="viewer-region" id="material-viewer-region">
          <MaterialViewer
            course={course}
            selection={selection}
            onClose={() => setSelection(null)}
          />
        </div>
      </div>
    </main>
  )
}
