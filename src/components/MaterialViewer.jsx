import { useEffect, useRef } from 'react'
import Icon from './Icon.jsx'
import RemoteImage from './RemoteImage.jsx'
import Markdown from './Markdown.jsx'
import { materialTypeMeta } from '../data/display.js'

/**
 * Persistent right-hand study viewer.
 * Default state: the course's main image. When a syllabus material is
 * selected, its content (PDF, video, YouTube embed, or rendered Markdown)
 * replaces the image without leaving the course page.
 */
export default function MaterialViewer({ course, material, onClose }) {
  const titleRef = useRef(null)
  const defaultRef = useRef(null)
  const prevMaterialRef = useRef(material)

  useEffect(() => {
    if (material) {
      titleRef.current?.focus()
    } else if (prevMaterialRef.current) {
      // A material was just closed — hand focus back to the default view.
      defaultRef.current?.focus()
    }
    prevMaterialRef.current = material
  }, [material])

  if (!material) {
    return (
      <div
        className="viewer viewer--default"
        ref={defaultRef}
        tabIndex={-1}
        aria-label="Course cover image"
      >
        <p className="viewer__status">
          <Icon name="image" size={14} /> Showing course cover
        </p>
        <figure className="viewer__frame">
          <RemoteImage
            src={course.imageUrl}
            alt={`Main image for ${course.name}`}
            className="viewer__image"
            fallbackLabel={course.id}
          />
          <figcaption className="viewer__caption">
            <span className="viewer__caption-code">{course.id}</span>
            <span className="viewer__caption-title">{course.name}</span>
          </figcaption>
        </figure>
        <p className="viewer__hint">
          {course.materialCount > 0
            ? `${course.materialCount} course ${course.materialCount === 1 ? 'material' : 'materials'} posted — select one from the syllabus to study it here.`
            : 'Materials for this course will appear here as they are posted.'}
        </p>
      </div>
    )
  }

  const meta = materialTypeMeta(material.type)
  const cls = course.classes.find((c) => c.id === material.classId)
  const openHref = material.view === 'youtube' ? material.href : material.src

  return (
    <div className="viewer viewer--material">
      <div className="viewer__header">
        <p className="viewer__context">
          <span className={`viewer__badge viewer__badge--${material.type}`}>
            <Icon name={meta.icon} size={13} /> {meta.label}
          </span>
          {cls && <span className="viewer__class">{cls.name}</span>}
        </p>
        <h2 className="viewer__title" tabIndex={-1} ref={titleRef}>
          {material.title}
        </h2>
        <div className="viewer__actions">
          {openHref && (
            <a
              className="viewer__action"
              href={openHref}
              target="_blank"
              rel="noreferrer"
              title="Open the original file in a new tab"
            >
              <Icon name="external" size={15} /> Open original
            </a>
          )}
          <button
            type="button"
            className="viewer__action viewer__action--close"
            onClick={onClose}
            title="Close material and return to the course image (Esc)"
          >
            <Icon name="close" size={15} /> Close
            <span className="visually-hidden"> material viewer</span>
          </button>
        </div>
      </div>

      <div className="viewer__body">
        {material.view === 'pdf' && (
          <iframe
            className="viewer__pdf"
            src={material.src}
            title={`PDF document: ${material.title}`}
          />
        )}
        {material.view === 'video' && (
          <video className="viewer__video" src={material.src} controls preload="metadata">
            Your browser does not support embedded video.{' '}
            <a href={material.src} target="_blank" rel="noreferrer">
              Open the video in a new tab
            </a>
            .
          </video>
        )}
        {material.view === 'youtube' && (
          <div className="viewer__youtube">
            <iframe
              src={material.src}
              title={`YouTube video: ${material.title}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        )}
        {material.view === 'markdown' && (
          <div
            className="viewer__markdown"
            tabIndex={0}
            role="region"
            aria-label={`Scrollable document: ${material.title}`}
          >
            <Markdown text={material.text} />
          </div>
        )}
        {material.view === 'link' && (
          <div className="viewer__link-fallback">
            <p>This resource is available as an external file.</p>
            <a className="viewer__action" href={material.href} target="_blank" rel="noreferrer">
              <Icon name="external" size={15} /> Open resource
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
