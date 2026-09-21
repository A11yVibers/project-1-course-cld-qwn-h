import { parseCSV } from './csv.js'

// Source data is read from the immutable project-assets/ CSV files at build
// time. Nothing is duplicated here — this module only parses and joins.
import coursesRaw from '../../project-assets/history_courses.csv?raw'
import instructorsRaw from '../../project-assets/history_instructors.csv?raw'
import classesRaw from '../../project-assets/history_classes.csv?raw'
import materialsRaw from '../../project-assets/course_materials.csv?raw'

import { resolveMaterial } from './materials.js'

const instructorRows = parseCSV(instructorsRaw)
const courseRows = parseCSV(coursesRaw)
const classRows = parseCSV(classesRaw)
const materialRows = parseCSV(materialsRaw)

/** @type {Map<string, object>} instructor_id → instructor record */
export const instructorsById = new Map(
  instructorRows.map((row) => [
    row.instructor_id,
    {
      id: row.instructor_id,
      name: row.name,
      email: row.email,
      photoUrl: row.photo_url,
    },
  ]),
)

/** materials grouped by class_id, sorted by display_order, each resolved to a viewable form */
export const materialsByClass = new Map()
for (const row of materialRows) {
  const list = materialsByClass.get(row.class_id) ?? []
  list.push({
    id: row.material_id,
    classId: row.class_id,
    courseId: row.course_id,
    title: row.material_title,
    type: row.material_type,
    order: Number(row.display_order),
    ...resolveMaterial(row.file_path, row.material_type),
  })
  materialsByClass.set(row.class_id, list)
}
for (const list of materialsByClass.values()) {
  list.sort((a, b) => a.order - b.order)
}

/** classes grouped by course_id, ordered by class_id, with materials attached */
export const classesByCourse = new Map()
for (const row of classRows) {
  const list = classesByCourse.get(row.course_id) ?? []
  list.push({
    id: row.class_id,
    courseId: row.course_id,
    weekNumber: Number(row.week_number),
    date: row.date,
    name: row.class_name,
    materials: materialsByClass.get(row.class_id) ?? [],
  })
  classesByCourse.set(row.course_id, list)
}
for (const list of classesByCourse.values()) {
  list.sort((a, b) => a.id.localeCompare(b.id))
}

/** full course records with instructor joined and classes attached */
export const courses = courseRows.map((row) => {
  const course = {
    id: row.course_id,
    name: row.name,
    shortDescription: row.short_description,
    longDescription: row.long_description,
    numberOfClasses: Number(row.number_of_classes),
    numberOfWeeks: Number(row.number_of_weeks),
    imageUrl: row.image_url,
    instructor: instructorsById.get(row.instructor_id) ?? null,
    classes: classesByCourse.get(row.course_id) ?? [],
  }
  course.materialCount = course.classes.reduce((n, c) => n + c.materials.length, 0)
  return course
})

const coursesById = new Map(courses.map((c) => [c.id, c]))

export function getCourse(courseId) {
  return coursesById.get(courseId) ?? null
}

export const instructors = [...instructorsById.values()]

/** Term label derived from the earliest/latest class dates in the data. */
function deriveTermLabel() {
  const dates = classRows.map((r) => r.date).filter(Boolean).sort()
  if (dates.length === 0) return ''
  const first = new Date(`${dates[0]}T00:00:00`)
  const year = first.getFullYear()
  const month = first.getMonth()
  const term = month <= 1 ? 'Winter' : month <= 4 ? 'Spring' : month <= 7 ? 'Summer' : 'Fall'
  return `${term} ${year}`
}

/** Aggregate stats derived from the source data (used by the catalog hero). */
export const catalogStats = {
  courseCount: courses.length,
  classCount: courses.reduce((n, c) => n + c.numberOfClasses, 0),
  instructorCount: instructors.length,
  weekCount: Math.max(...courses.map((c) => c.numberOfWeeks), 0),
  termLabel: deriveTermLabel(),
}
