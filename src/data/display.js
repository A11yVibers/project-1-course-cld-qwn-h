// Presentation helpers derived from the source data formats.

/** Split an ISO class date (YYYY-MM-DD) into display parts. */
export function formatClassDate(iso) {
  const d = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(d.getTime())) return { weekday: '', monthDay: iso, full: iso }
  return {
    weekday: d.toLocaleDateString('en-US', { weekday: 'short' }),
    monthDay: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    full: d.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
  }
}

/** Icon + label + color class per material_type value from course_materials.csv. */
export const MATERIAL_TYPE_META = {
  pdf: { label: 'PDF reading', short: 'PDF', icon: 'fileText' },
  video: { label: 'Lecture video', short: 'Video', icon: 'play' },
  youtube: { label: 'YouTube video', short: 'YouTube', icon: 'youtube' },
  md: { label: 'Assignment', short: 'MD', icon: 'fileText' },
}

export function materialTypeMeta(type) {
  return MATERIAL_TYPE_META[type] ?? { label: 'Resource', short: 'File', icon: 'fileText' }
}
