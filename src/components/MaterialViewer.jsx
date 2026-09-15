import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { materialTypeMeta, toYouTubeEmbed, formatDate } from '../lib/materials.js'
import { CourseImage } from './Images.jsx'
import {
  MaterialIcon,
  IconClose,
  IconExternal,
  IconChevron,
} from './icons.jsx'

/** Default pane content: the course's main image with a caption card. */
function CoursePreview({ course }) {
  return (
    <div className="course-preview">
      <div className="preview-media">
        <CourseImage
          src={course.imageUrl}
          alt={course.name}
          label={course.id}
          className="preview-image"
        />
        <div className="preview-scrim" aria-hidden="true" />
        <div className="preview-caption">
          <p className="preview-eyebrow">
            {course.id} · {course.numberOfWeeks} weeks · {course.numberOfClasses} classes
          </p>
          <h2>{course.name}</h2>
          <p className="preview-short">{course.shortDescription}</p>
        </div>
      </div>
      <p className="preview-hint">
        <IconChevron size={14} direction="left" />
        Select a material from the syllabus to study it here — lectures, readings, and
        assignments open in this pane without leaving the course.
      </p>
    </div>
  )
}

function ViewerBody({ material }) {
  switch (material.type) {
    case 'pdf':
      return material.url ? (
        <iframe
          className="viewer-frame"
          src={material.url}
          title={material.title}
          loading="lazy"
        />
      ) : (
        <Unavailable material={material} />
      )

    case 'video':
      return material.url ? (
        <div className="viewer-stage">
          <video className="viewer-video" src={material.url} controls preload="metadata">
            Your browser does not support embedded video.
          </video>
        </div>
      ) : (
        <Unavailable material={material} />
      )

    case 'youtube':
      return material.url ? (
        <div className="viewer-stage">
          <div className="viewer-aspect">
            <iframe
              src={toYouTubeEmbed(material.url)}
              title={material.title}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      ) : (
        <Unavailable material={material} />
      )

    case 'md':
      return material.text ? (
        <div className="viewer-scroll">
          <article className="markdown-card markdown-body">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{material.text}</ReactMarkdown>
          </article>
        </div>
      ) : (
        <Unavailable material={material} />
      )

    default:
      if (material.text) {
        return (
          <div className="viewer-scroll">
            <pre className="markdown-card">{material.text}</pre>
          </div>
        )
      }
      return <Unavailable material={material} />
  }
}

function Unavailable({ material }) {
  return (
    <div className="viewer-unavailable">
      <MaterialIcon type={material.type} size={28} />
      <p>This material could not be loaded in the viewer.</p>
      {material.url && (
        <a href={material.url} target="_blank" rel="noreferrer">
          Open it in a new tab
        </a>
      )}
    </div>
  )
}

/**
 * Persistent material-viewing pane. Shows the course image by default and
 * swaps in the selected material without leaving the course page.
 */
export default function MaterialViewer({ course, active, onSelectClose }) {
  if (!active) {
    return <CoursePreview course={course} />
  }

  const { material, classEntry } = active
  const meta = materialTypeMeta(material.type)
  const externalUrl =
    material.type === 'md' || !material.url ? null : material.url

  return (
    <div className="viewer">
      <header className="viewer-header">
        <div className="viewer-heading">
          <span className={`type-badge ${meta.badgeClass}`}>
            <MaterialIcon type={material.type} size={14} />
            {meta.label}
          </span>
          <div className="viewer-titles">
            <h2>{material.title}</h2>
            <p className="viewer-context">
              {classEntry.name} · {formatDate(classEntry.date)}
            </p>
          </div>
        </div>
        <div className="viewer-actions">
          {externalUrl && (
            <a
              className="viewer-action"
              href={externalUrl}
              target="_blank"
              rel="noreferrer"
              title="Open in a new tab"
            >
              <IconExternal size={15} />
              <span>Open</span>
            </a>
          )}
          <button
            type="button"
            className="viewer-action"
            onClick={onSelectClose}
            title="Close material and show the course image"
          >
            <IconClose size={15} />
            <span>Course image</span>
          </button>
        </div>
      </header>
      <div className="viewer-content">
        <ViewerBody material={material} />
      </div>
    </div>
  )
}
