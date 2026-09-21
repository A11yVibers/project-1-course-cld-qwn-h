import { formatClassDate, materialTypeMeta } from '../data/display.js'
import Icon from './Icon.jsx'

/**
 * Syllabus table: week number, class date, and class content.
 * The content cell shows the class title followed by the materials available
 * for that class (per course_materials.csv). Week cells span their classes.
 */
export default function SyllabusTable({ course, selectedMaterialId, onSelectMaterial }) {
  const classes = course.classes

  // Number of rows each week spans, so the Week column can use rowSpan.
  const weekSpans = new Map()
  for (const cls of classes) {
    weekSpans.set(cls.weekNumber, (weekSpans.get(cls.weekNumber) ?? 0) + 1)
  }
  const weekRendered = new Set()

  return (
    <div className="syllabus-table-wrap">
      <table className="syllabus-table">
        <caption className="visually-hidden">
          {`Syllabus for ${course.name}: ${classes.length} classes across ${course.numberOfWeeks} weeks, with week number, meeting date, class title, and available materials.`}
        </caption>
        <thead>
          <tr>
            <th scope="col" className="syllabus-table__week-col">Week</th>
            <th scope="col" className="syllabus-table__date-col">Date</th>
            <th scope="col">Class Content</th>
          </tr>
        </thead>
        <tbody>
          {classes.map((cls) => {
            const date = formatClassDate(cls.date)
            const renderWeekCell = !weekRendered.has(cls.weekNumber)
            if (renderWeekCell) weekRendered.add(cls.weekNumber)

            return (
              <tr key={cls.id} className={renderWeekCell ? 'is-week-start' : ''}>
                {renderWeekCell && (
                  <th
                    scope="rowgroup"
                    className="syllabus-table__week"
                    rowSpan={weekSpans.get(cls.weekNumber)}
                  >
                    <span className="week-badge" title={`Week ${cls.weekNumber}`}>
                      <span className="week-badge__label">Week</span>
                      <span className="week-badge__number">{cls.weekNumber}</span>
                    </span>
                  </th>
                )}
                <td className="syllabus-table__date">
                  <time dateTime={cls.date} title={date.full}>
                    <span className="syllabus-table__weekday">{date.weekday}</span>
                    <span className="syllabus-table__monthday">{date.monthDay}</span>
                  </time>
                </td>
                <td className="syllabus-table__content">
                  <p className="syllabus-table__class-name">{cls.name}</p>
                  {cls.materials.length > 0 ? (
                    <ul className="material-list">
                      {cls.materials.map((material) => {
                        const meta = materialTypeMeta(material.type)
                        const isActive = material.id === selectedMaterialId
                        return (
                          <li key={material.id}>
                            <button
                              type="button"
                              className={isActive ? 'material-chip is-active' : 'material-chip'}
                              onClick={() => onSelectMaterial(isActive ? null : material)}
                              aria-current={isActive ? 'true' : undefined}
                              title={`Open “${material.title}” in the study viewer`}
                            >
                              <span className={`material-chip__icon material-chip__icon--${material.type}`}>
                                <Icon name={meta.icon} size={14} />
                              </span>
                              <span className="material-chip__title">{material.title}</span>
                              <span className="material-chip__type">{meta.short}</span>
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  ) : (
                    <p className="syllabus-table__no-materials">Materials not posted yet</p>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
