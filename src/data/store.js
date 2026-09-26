// Derives all application data from the immutable supplied inputs in project-assets/.
// Nothing is duplicated here: CSVs are parsed at module load and material files are
// resolved through Vite's asset pipeline directly from project-assets/materials/.
import Papa from 'papaparse'

import coursesCsv from '../../project-assets/history_courses.csv?raw'
import classesCsv from '../../project-assets/history_classes.csv?raw'
import instructorsCsv from '../../project-assets/history_instructors.csv?raw'
import materialsCsv from '../../project-assets/course_materials.csv?raw'

// Every file supplied under project-assets/materials/, mapped to a servable URL.
const materialAssetUrls = import.meta.glob('../../project-assets/materials/*', {
  eager: true,
  query: '?url',
  import: 'default',
})

// Markdown materials are additionally bundled as raw text so they can be rendered inline.
const materialAssetTexts = import.meta.glob('../../project-assets/materials/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

function parseCsv(text) {
  // The supplied CSVs mix CRLF and LF line endings (e.g. course_materials.csv has a
  // CRLF header but LF data rows). Normalize first so the parser can't merge rows.
  const normalized = text.replace(/\r\n|\r/g, '\n')
  return Papa.parse(normalized.trim(), { header: true, skipEmptyLines: true }).data
}

function findAsset(glob, filePath) {
  if (!filePath) return null
  const match = Object.entries(glob).find(([key]) => key.endsWith(`/${filePath}`))
  return match ? match[1] : null
}

function toNumber(value, fallback = 0) {
  const n = Number.parseInt(value, 10)
  return Number.isFinite(n) ? n : fallback
}

/** Turns https://youtu.be/ID?... or https://www.youtube.com/watch?v=ID... into an embed URL. */
export function youTubeEmbedUrl(url) {
  try {
    const parsed = new URL(url)
    let id = null
    if (parsed.hostname.endsWith('youtu.be')) {
      id = parsed.pathname.slice(1).split('/')[0]
    } else if (parsed.hostname.includes('youtube.com')) {
      id = parsed.searchParams.get('v')
    }
    return id ? `https://www.youtube-nocookie.com/embed/${id}` : null
  } catch {
    return null
  }
}

function buildMaterial(row) {
  const type = (row.material_type || '').trim().toLowerCase()
  const filePath = (row.file_path || '').trim()
  const isRemote = /^https?:\/\//i.test(filePath)

  const material = {
    id: row.material_id,
    classId: row.class_id,
    courseId: row.course_id,
    order: toNumber(row.display_order, 0),
    title: row.material_title,
    type,
    filePath,
    url: null,
    text: null,
    external: isRemote,
  }

  if (type === 'youtube') {
    material.url = isRemote ? youTubeEmbedUrl(filePath) : null
    material.externalUrl = filePath
  } else if (isRemote) {
    material.url = filePath
  } else {
    material.url = findAsset(materialAssetUrls, filePath)
    if (type === 'md') material.text = findAsset(materialAssetTexts, filePath)
  }
  return material
}

const instructorRows = parseCsv(instructorsCsv)
const courseRows = parseCsv(coursesCsv)
const classRows = parseCsv(classesCsv)
const materialRows = parseCsv(materialsCsv)

/** instructor_id -> instructor record */
export const instructorsById = new Map(
  instructorRows.map((row) => [
    row.instructor_id,
    { id: row.instructor_id, name: row.name, email: row.email, photoUrl: row.photo_url },
  ]),
)

const materialsByClassId = new Map()
for (const row of materialRows) {
  const material = buildMaterial(row)
  if (!materialsByClassId.has(material.classId)) materialsByClassId.set(material.classId, [])
  materialsByClassId.get(material.classId).push(material)
}
for (const list of materialsByClassId.values()) list.sort((a, b) => a.order - b.order)

const classesByCourseId = new Map()
for (const row of classRows) {
  const cls = {
    id: row.class_id,
    courseId: row.course_id,
    weekNumber: toNumber(row.week_number, 1),
    date: row.date,
    name: row.class_name,
    materials: materialsByClassId.get(row.class_id) || [],
  }
  if (!classesByCourseId.has(cls.courseId)) classesByCourseId.set(cls.courseId, [])
  classesByCourseId.get(cls.courseId).push(cls)
}
for (const list of classesByCourseId.values()) {
  list.sort((a, b) => a.weekNumber - b.weekNumber || a.date.localeCompare(b.date) || a.id.localeCompare(b.id))
}

/** All courses, joined with their instructor and class list. */
export const courses = courseRows
  .map((row) => ({
    id: row.course_id,
    name: row.name,
    shortDescription: row.short_description,
    longDescription: row.long_description,
    numberOfClasses: toNumber(row.number_of_classes),
    numberOfWeeks: toNumber(row.number_of_weeks),
    instructor: instructorsById.get(row.instructor_id) || null,
    imageUrl: row.image_url,
    classes: classesByCourseId.get(row.course_id) || [],
  }))
  .sort((a, b) => a.id.localeCompare(b.id))

export const coursesById = new Map(courses.map((course) => [course.id, course]))

/** Instructors actually teaching in the catalog, in course order of first appearance. */
export const instructors = [...new Map(courses.filter((c) => c.instructor).map((c) => [c.instructor.id, c.instructor])).values()]

export function getCourse(courseId) {
  return coursesById.get(courseId) || null
}

export const catalogStats = {
  courseCount: courses.length,
  classCount: courses.reduce((sum, c) => sum + c.classes.length, 0),
  instructorCount: instructors.length,
  materialCount: materialRows.length,
}

const dateFormatters = {
  long: new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' }),
  short: new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }),
}

/** Formats an ISO date (YYYY-MM-DD) without timezone drift. */
export function formatClassDate(isoDate, style = 'long') {
  const date = new Date(`${isoDate}T00:00:00Z`)
  if (Number.isNaN(date.getTime())) return isoDate
  return dateFormatters[style].format(date)
}

export const MATERIAL_TYPE_META = {
  pdf: { label: 'PDF', group: 'document' },
  md: { label: 'Markdown', group: 'document' },
  video: { label: 'Video', group: 'video' },
  youtube: { label: 'YouTube', group: 'video' },
}

export function materialTypeMeta(type) {
  return MATERIAL_TYPE_META[type] || { label: type ? type.toUpperCase() : 'File', group: 'document' }
}
