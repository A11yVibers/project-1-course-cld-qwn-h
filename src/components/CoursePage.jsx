import { useEffect, useState } from 'react'
import Icon from './Icon.jsx'
import RemoteImage from './RemoteImage.jsx'
import SyllabusTable from './SyllabusTable.jsx'
import MaterialViewer from './MaterialViewer.jsx'
import { catalogStats } from '../data/catalog.js'

export default function CoursePage({ course }) {
  const [collapsed, setCollapsed] = useState(false)
  const [selectedMaterial, setSelectedMaterial] = useState(null)

  // Escape returns the viewer to the default course image.
  useEffect(() => {
    if (!selectedMaterial) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') setSelectedMaterial(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedMaterial])

  const layoutClasses = [
    'course-layout',
    collapsed ? 'is-collapsed' : '',
    selectedMaterial ? 'is-viewer-open' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className="course-page">
      <div className="course-topbar">
        <div className="course-topbar__inner">
          <a className="course-topbar__back" href="#/">
            <Icon name="arrowLeft" size={16} /> All courses
          </a>
          <span className="course-topbar__code">{course.id}</span>
          <p className="course-topbar__title">{course.name}</p>
          <button
            type="button"
            className="course-topbar__collapse"
            onClick={() => setCollapsed((v) => !v)}
            aria-expanded={!collapsed}
            aria-controls="course-info-panel"
          >
            <Icon name="panelLeft" size={16} />
            {collapsed ? 'Show course panel' : 'Hide course panel'}
          </button>
        </div>
      </div>

      <div className={layoutClasses}>
        {/* Collapsed rail (visible only when the left pane is hidden) */}
        <div className="course-rail" aria-hidden={collapsed ? 'false' : 'true'}>
          <button
            type="button"
            className="course-rail__button"
            onClick={() => setCollapsed(false)}
            tabIndex={collapsed ? 0 : -1}
            aria-controls="course-info-panel"
            aria-expanded="false"
          >
            <Icon name="chevronRight" size={16} />
            <span className="course-rail__label">Course &amp; syllabus</span>
          </button>
        </div>

        <aside className="course-left" id="course-info-panel" aria-label="Course information and syllabus">
          <section className="course-info card" aria-labelledby="course-info-title">
            <p className="course-info__eyebrow">
              {catalogStats.termLabel} · {course.numberOfWeeks}-week course
            </p>
            <h1 className="course-info__title" id="course-info-title">
              {course.name}
            </h1>
            <p className="course-info__desc">{course.longDescription}</p>

            <dl className="course-info__stats">
              <div>
                <dt>Classes</dt>
                <dd>{course.numberOfClasses}</dd>
              </div>
              <div>
                <dt>Weeks</dt>
                <dd>{course.numberOfWeeks}</dd>
              </div>
              <div>
                <dt>Materials</dt>
                <dd>{course.materialCount}</dd>
              </div>
            </dl>

            {course.instructor && (
              <div className="instructor-card">
                <RemoteImage
                  src={course.instructor.photoUrl}
                  alt={`Portrait of ${course.instructor.name}`}
                  className="instructor-card__photo"
                  fallbackLabel={course.instructor.name}
                />
                <div className="instructor-card__details">
                  <p className="instructor-card__role">Course instructor</p>
                  <p className="instructor-card__name">{course.instructor.name}</p>
                  <a className="instructor-card__email" href={`mailto:${course.instructor.email}`}>
                    <Icon name="mail" size={14} /> {course.instructor.email}
                  </a>
                </div>
              </div>
            )}
          </section>

          <section className="course-syllabus card" aria-labelledby="syllabus-title">
            <div className="course-syllabus__heading">
              <h2 id="syllabus-title" className="section-title section-title--sm">
                Syllabus
              </h2>
              <p className="course-syllabus__hint">
                <Icon name="image" size={14} /> Select a material to open it in the study viewer.
              </p>
            </div>
            <SyllabusTable
              course={course}
              selectedMaterialId={selectedMaterial?.id ?? null}
              onSelectMaterial={setSelectedMaterial}
            />
          </section>
        </aside>

        <section className="course-right" aria-label="Study viewer">
          <MaterialViewer
            course={course}
            material={selectedMaterial}
            onClose={() => setSelectedMaterial(null)}
          />
        </section>
      </div>
    </div>
  )
}
