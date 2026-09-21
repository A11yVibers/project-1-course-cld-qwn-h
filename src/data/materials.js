// Links the material file paths referenced in course_materials.csv to the
// actual files under project-assets/materials/ (imported through Vite so they
// are served in dev and emitted into the build). The source files themselves
// are never modified.
import lecturePdfUrl from '../../project-assets/materials/silk_roads_class_01_lecture.pdf?url'
import lectureVideoUrl from '../../project-assets/materials/silk_roads_class_01_lecture.mp4?url'
import assignmentMdText from '../../project-assets/materials/silk_roads_class_02_assignment.md?raw'

/** file_path values (as they appear in course_materials.csv) → bundled sources */
const LOCAL_MATERIALS = new Map([
  ['materials/silk_roads_class_01_lecture.pdf', { view: 'pdf', src: lecturePdfUrl }],
  ['materials/silk_roads_class_01_lecture.mp4', { view: 'video', src: lectureVideoUrl }],
  ['materials/silk_roads_class_02_assignment.md', { view: 'markdown', text: assignmentMdText }],
])

/** Convert a YouTube share/watch URL into an embeddable privacy-enhanced URL. */
function toYouTubeEmbed(url) {
  let id = null
  const shortened = url.match(/youtu\.be\/([\w-]+)/)
  const standard = url.match(/[?&]v=([\w-]+)/)
  if (shortened) id = shortened[1]
  else if (standard) id = standard[1]
  if (!id) return null
  return `https://www.youtube-nocookie.com/embed/${id}`
}

/**
 * Resolve a (file_path, material_type) pair from course_materials.csv into a
 * descriptor the MaterialViewer can render:
 *   { view: 'pdf' | 'video' | 'youtube' | 'markdown' | 'link', src?, text?, href? }
 */
export function resolveMaterial(filePath, materialType) {
  const local = LOCAL_MATERIALS.get(filePath)
  if (local) return { ...local }

  const isRemote = /^https?:\/\//i.test(filePath)
  if (isRemote) {
    if (materialType === 'youtube' || /youtu\.be|youtube\.com/i.test(filePath)) {
      const embed = toYouTubeEmbed(filePath)
      if (embed) return { view: 'youtube', src: embed, href: filePath }
    }
    return { view: 'link', href: filePath }
  }

  // Unknown local path — fall back to linking the raw relative path.
  return { view: 'link', href: filePath }
}
