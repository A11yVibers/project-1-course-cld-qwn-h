import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { materialTypeMeta } from '../data/store.js'
import { CloseIcon, ExternalLinkIcon, ImageIcon, materialTypeIcon } from './icons.jsx'

function MarkdownDocument({ text, title }) {
  if (text == null) {
    return <ViewerFallback message="This document could not be loaded." />
  }
  return (
    <div className="viewer-scroll viewer-scroll--paper">
      <article className="doc-paper">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
      </article>
    </div>
  )
}

function ViewerFallback({ message }) {
  return (
    <div className="viewer-fallback">
      <p>{message}</p>
    </div>
  )
}

function DefaultPlate({ course }) {
  return (
    <div className="viewer-plate">
      <div className="viewer-plate__stage">
        <img src={course.imageUrl} alt={`Course image for ${course.name}`} />
      </div>
      <div className="viewer-plate__caption">
        <span className="viewer-plate__hint">
          <ImageIcon size={15} />
          Select any material in the syllabus to open it here.
        </span>
        <a className="viewer-plate__credit" href={course.imageUrl} target="_blank" rel="noreferrer">
          Course image · Wikimedia Commons <ExternalLinkIcon size={13} />
        </a>
      </div>
    </div>
  )
}

export default function MaterialViewer({ course, selection, onClose }) {
  // selection: { material, cls } | null
  const material = selection?.material ?? null
  const cls = selection?.cls ?? null

  // Reload video/iframe embeds when switching materials instead of resuming stale state.
  const [viewerKey, setViewerKey] = useState(0)
  useEffect(() => {
    setViewerKey((k) => k + 1)
  }, [material?.id])

  useEffect(() => {
    if (material) {
      document.title = `${material.title} · ${course.name}`
    } else {
      document.title = `${course.name} · Meridian History`
    }
  }, [material, course.name])

  const meta = material ? materialTypeMeta(material.type) : null
  const TypeIcon = material ? materialTypeIcon(material.type) : ImageIcon

  function renderBody() {
    if (!material) return <DefaultPlate course={course} />
    if (!material.url && material.type !== 'md') {
      return <ViewerFallback message="This material is not available in the bundled assets yet." />
    }

    switch (material.type) {
      case 'pdf':
        return (
          <div className="viewer-embed">
            <iframe key={viewerKey} src={material.url} title={material.title} className="viewer-frame" />
          </div>
        )
      case 'video':
        return (
          <div className="viewer-media">
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video key={viewerKey} src={material.url} controls preload="metadata" className="viewer-video">
              Your browser does not support embedded video.
            </video>
          </div>
        )
      case 'youtube':
        return (
          <div className="viewer-media">
            <iframe
              key={viewerKey}
              className="viewer-youtube"
              src={material.url}
              title={material.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        )
      case 'md':
        return <MarkdownDocument key={viewerKey} text={material.text} title={material.title} />
      default:
        return (
          <div className="viewer-embed">
            <iframe key={viewerKey} src={material.url} title={material.title} className="viewer-frame" />
          </div>
        )
    }
  }

  return (
    <section className="material-viewer" aria-label="Material viewer">
      <header className="material-viewer__bar">
        <div className="material-viewer__title">
          {material ? (
            <>
              <span className="viewer-type-badge">
                <TypeIcon size={15} />
                {meta.label}
              </span>
              <div className="material-viewer__text">
                <strong>{material.title}</strong>
                {cls && (
                  <span className="material-viewer__context">
                    Week {cls.weekNumber} · {cls.name}
                  </span>
                )}
              </div>
            </>
          ) : (
            <>
              <span className="viewer-type-badge viewer-type-badge--image">
                <ImageIcon size={15} />
                Course image
              </span>
              <div className="material-viewer__text">
                <strong>{course.name}</strong>
                <span className="material-viewer__context">{course.id} · default view</span>
              </div>
            </>
          )}
        </div>
        <div className="material-viewer__actions">
          {material && !material.external && material.url && (
            <a className="viewer-action" href={material.url} target="_blank" rel="noreferrer">
              <ExternalLinkIcon size={14} /> Open in new tab
            </a>
          )}
          {material && material.type === 'youtube' && material.externalUrl && (
            <a className="viewer-action" href={material.externalUrl} target="_blank" rel="noreferrer">
              <ExternalLinkIcon size={14} /> Watch on YouTube
            </a>
          )}
          {material && (
            <button type="button" className="viewer-action viewer-action--close" onClick={onClose}>
              <CloseIcon size={14} /> Back to course image
            </button>
          )}
        </div>
      </header>
      <div className="material-viewer__body">{renderBody()}</div>
    </section>
  )
}
