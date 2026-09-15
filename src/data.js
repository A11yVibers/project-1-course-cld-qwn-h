/**
 * Application data layer.
 *
 * All course, class, instructor, and material data is derived from the
 * immutable source files in project-assets/. CSVs are imported as raw text
 * and parsed at module load; material files are resolved through Vite's
 * import.meta.glob so the CSV remains the single source of truth for which
 * material belongs to which class.
 */
import { parseCsv } from './lib/csv.js'

import coursesCsv from '../project-assets/history_courses.csv?raw'
import classesCsv from '../project-assets/history_classes.csv?raw'
import instructorsCsv from '../project-assets/history_instructors.csv?raw'
import materialsCsv from '../project-assets/course_materials.csv?raw'

// Bundled asset URLs for every file in project-assets/materials (keyed by
// glob path), plus raw text for markdown-style materials we render inline.
const assetUrls = import.meta.glob('../project-assets/materials/*', {
  eager: true,
  query: '?url',
  import: 'default',
})
const rawTexts = import.meta.glob('../project-assets/materials/*.{md,markdown,txt}', {
  eager: true,
  query: '?raw',
  import: 'default',
})

const isRemote = (value) => /^https?:\/\//i.test(value)

function resolveMaterialFile(filePath) {
  if (isRemote(filePath)) {
    return { url: filePath, text: null }
  }
  const globKey = `../project-assets/${filePath.replace(/^\/+/, '')}`
  return { url: assetUrls[globKey] ?? null, text: rawTexts[globKey] ?? null }
}

/** Instructors keyed by instructor_id. */
export const instructors = Object.fromEntries(
  parseCsv(instructorsCsv).map((row) => [
    row.instructor_id,
    {
      id: row.instructor_id,
      name: row.name,
      email: row.email,
      photoUrl: row.photo_url || null,
    },
  ]),
)

/** Materials keyed by material_id, joined to their class and course. */
const materials = parseCsv(materialsCsv).map((row) => {
  const { url, text } = resolveMaterialFile(row.file_path)
  return {
    id: row.material_id,
    courseId: row.course_id,
    classId: row.class_id,
    displayOrder: Number(row.display_order) || 0,
    title: row.material_title,
    type: row.material_type.toLowerCase(),
    filePath: row.file_path,
    url,
    text,
    external: isRemote(row.file_path),
  }
})

const materialsByClass = new Map()
for (const material of materials) {
  if (!materialsByClass.has(material.classId)) materialsByClass.set(material.classId, [])
  materialsByClass.get(material.classId).push(material)
}
for (const list of materialsByClass.values()) {
  list.sort((a, b) => a.displayOrder - b.displayOrder)
}

/** Classes keyed by course_id, ordered by week number then date. */
export const classesByCourse = (() => {
  const grouped = {}
  for (const row of parseCsv(classesCsv)) {
    const classId = row.class_id
    if (!grouped[row.course_id]) grouped[row.course_id] = []
    grouped[row.course_id].push({
      id: classId,
      courseId: row.course_id,
      weekNumber: Number(row.week_number) || 0,
      date: row.date,
      name: row.class_name,
      materials: materialsByClass.get(classId) ?? [],
    })
  }
  for (const list of Object.values(grouped)) {
    list.sort((a, b) => a.weekNumber - b.weekNumber || a.date.localeCompare(b.date))
  }
  return grouped
})()

/** All courses, joined with their instructor and class list. */
export const courses = parseCsv(coursesCsv).map((row) => {
  const classes = classesByCourse[row.course_id] ?? []
  return {
    id: row.course_id,
    name: row.name,
    shortDescription: row.short_description,
    longDescription: row.long_description,
    numberOfClasses: Number(row.number_of_classes) || classes.length,
    numberOfWeeks: Number(row.number_of_weeks) || 0,
    instructorId: row.instructor_id,
    instructor: instructors[row.instructor_id] ?? null,
    imageUrl: row.image_url || null,
    classes,
    materialCount: classes.reduce((total, cls) => total + cls.materials.length, 0),
  }
})

export const coursesById = Object.fromEntries(courses.map((course) => [course.id, course]))

/** Courses that already have posted materials — used to spotlight examples. */
export const coursesWithMaterials = courses.filter((course) => course.materialCount > 0)

export const platformStats = {
  courseCount: courses.length,
  classCount: courses.reduce((total, course) => total + course.classes.length, 0),
  instructorCount: Object.keys(instructors).length,
  weekCount: Math.max(...courses.map((course) => course.numberOfWeeks), 0),
}
