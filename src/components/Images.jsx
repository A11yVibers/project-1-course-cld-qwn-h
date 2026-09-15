import { useState } from 'react'
import { initials } from '../lib/materials.js'

/**
 * Remote course image with a graceful styled fallback.
 * Only remote URLs from project-assets data are ever loaded — no local images.
 */
export function CourseImage({ src, alt, label = '', className = '' }) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <div className={`image-fallback ${className}`} role="img" aria-label={alt || 'Course image unavailable'}>
        <span className="image-fallback-label">{label || 'Agora'}</span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  )
}

/** Instructor avatar with initials fallback. */
export function InstructorAvatar({ instructor, size = 32 }) {
  const [failed, setFailed] = useState(false)

  if (!instructor?.photoUrl || failed) {
    return (
      <span
        className="avatar avatar-fallback"
        style={{ width: size, height: size, fontSize: Math.round(size * 0.4) }}
        aria-hidden="true"
      >
        {initials(instructor?.name)}
      </span>
    )
  }

  return (
    <img
      src={instructor.photoUrl}
      alt=""
      className="avatar"
      style={{ width: size, height: size }}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  )
}
