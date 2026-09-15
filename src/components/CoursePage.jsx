import { useEffect, useMemo, useRef, useState } from 'react'
import { materialTypeMeta, formatDate } from '../lib/materials.js'
import { InstructorAvatar } from './Images.jsx'
import MaterialViewer from './MaterialViewer.jsx'
import {
  MaterialIcon,
  IconChevron,
  IconPanelCollapse,
  IconCalendar,
  IconLayers,
  IconScroll,
} from './icons.jsx'

/** Group consecutive classes that share a week number, for rowSpan rendering. */
function groupByWeek(classes) {
  const groups = []
  for (const cls of classes) {
    const last = groups[groups.length - 1]
    if (last && last.week === cls.weekNumber) {
      last.classes.push(cls)
    } else {
      groups.push({ week: cls.weekNumber, classes: [cls] })
    }
  }
  return groups
}

function Syllabus({ course, activeMaterialId, onSelectMaterial }) {
  const weekGroups = useMemo(() => groupByWeek(course.classes), [course])

  return (
    <table className="syllabus-table">
      <thead>
        <tr>
          <th scope="col">Week</th>
          <th scope="col">Date</th>
          <th scope="col">Class content</th>
        </tr>
      </thead>
      <tbody>
        {weekGroups.map((group) =>
          group.classes.map((cls, index) => {
            const classIsActive = cls.materials.some((material) => material.id === activeMaterialId)
            return (
              <tr key={cls.id} className={classIsActive ? 'row-active' : undefined}>
                {index === 0 && (
                  <th
                    scope="rowgroup"
                    className="week-cell"
                    rowSpan={group.classes.length}
                  >
                    <span className="week-number">Week {group.week}</span>
                    <span className="week-count">
                      {group.classes.length} {group.classes.length === 1 ? 'class' : 'classes'}
                    </span>
                  </th>
                )}
                <td className="date-cell">{formatDate(cls.date)}</td>
                <td className="content-cell">
                  <h4 className="class-title">{cls.name}</h4>
                  {cls.materials.length > 0 ? (
                    <ul className="material-list">
                      {cls.materials.map((material) => {
                        const meta = materialTypeMeta(material.type)
                        const isActive = material.id === activeMaterialId
                        return (
                          <li key={material.id}>
                            <button
                              type="button"
                              className={`material-chip ${isActive ? 'is-active' : ''}`}
                              onClick={() => onSelectMaterial(material.id)}
                              aria-pressed={isActive}
                            >
                              <span className={`chip-icon ${meta.badgeClass}`}>
                                <MaterialIcon type={material.type} size={15} />
                              </span>
                              <span className="chip-title">{material.title}</span>
                              <span className={`type-badge ${meta.badgeClass}`}>{meta.label}</span>
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  ) : (
                    <p className="material-empty">Course materials will be posted before class.</p>
                  )}
                </td>
              </tr>
            )
          }),
        )}
      </tbody>
    </table>
  )
}

export default function CoursePage({ course }) {
  const [collapsed, setCollapsed] = useState(false)
  const [activeMaterialId, setActiveMaterialId] = useState(null)
  const viewerRef = useRef(null)

  // Reset the pane and panel whenever a different course is opened.
  useEffect(() => {
    setCollapsed(false)
    setActiveMaterialId(null)
  }, [course.id])

  const active = useMemo(() => {
    if (!activeMaterialId) return null
    for (const classEntry of course.classes) {
      const material = classEntry.materials.find((entry) => entry.id === activeMaterialId)
      if (material) return { material, classEntry }
    }
    return null
  }, [course, activeMaterialId])

  // On small (stacked) screens, bring the viewer into sight when a material is picked.
  const handleSelectMaterial = (materialId) => {
    setActiveMaterialId(materialId)
    if (typeof window !== 'undefined' && window.matchMedia('(max-width: 980px)').matches) {
      window.requestAnimationFrame(() => {
        viewerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    }
  }

  const postedMaterials = course.materialCount

  return (
    <div className={`course-page ${collapsed ? 'is-collapsed' : ''}`}>
      <aside className="course-panel" aria-label="Course information and syllabus">
        {collapsed ? (
          <button
            type="button"
            className="collapse-rail"
            onClick={() => setCollapsed(false)}
            title="Expand course information and syllabus"
          >
            <IconChevron size={18} direction="right" />
            <span className="rail-label">Course &amp; syllabus</span>
          </button>
        ) : (
          <div className="panel-inner">
            <div className="panel-topline">
              <span className="panel-code">{course.id}</span>
              <button
                type="button"
                className="collapse-button"
                onClick={() => setCollapsed(true)}
                title="Collapse this panel"
              >
                <IconPanelCollapse size={16} />
                <span>Collapse</span>
              </button>
            </div>

            <h1 className="panel-title">{course.name}</h1>

            {course.instructor && (
              <div className="instructor-card">
                <InstructorAvatar instructor={course.instructor} size={40} />
                <div className="instructor-copy">
                  <strong>{course.instructor.name}</strong>
                  <a href={`mailto:${course.instructor.email}`}>{course.instructor.email}</a>
                </div>
              </div>
            )}

            <ul className="course-stats">
              <li>
                <IconCalendar size={16} />
                <div>
                  <strong>{course.numberOfWeeks}</strong>
                  <span>weeks</span>
                </div>
              </li>
              <li>
                <IconLayers size={16} />
                <div>
                  <strong>{course.numberOfClasses}</strong>
                  <span>classes</span>
                </div>
              </li>
              <li>
                <IconScroll size={16} />
                <div>
                  <strong>{postedMaterials}</strong>
                  <span>materials posted</span>
                </div>
              </li>
            </ul>

            <p className="panel-description">{course.longDescription}</p>

            <section className="syllabus-section" aria-label="Syllabus">
              <div className="section-heading">
                <h2>Syllabus</h2>
                <span className="section-note">{course.classes.length} scheduled classes</span>
              </div>
              <Syllabus
                course={course}
                activeMaterialId={activeMaterialId}
                onSelectMaterial={handleSelectMaterial}
              />
            </section>
          </div>
        )}
      </aside>

      <section className="viewer-pane" ref={viewerRef} aria-label="Material viewer" aria-live="polite">
        <MaterialViewer
          course={course}
          active={active}
          onSelectClose={() => setActiveMaterialId(null)}
        />
      </section>
    </div>
  )
}
