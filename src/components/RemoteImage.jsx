import { useState } from 'react'

/**
 * Renders a remote image URL from the project-assets data. If the remote file
 * fails to load, a styled text fallback is shown instead (no image files are
 * ever created or embedded locally).
 */
export default function RemoteImage({ src, alt, className = '', fallbackLabel, ...rest }) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <div className={`image-fallback ${className}`} role="img" aria-label={alt} {...rest}>
        <span className="image-fallback__label">{fallbackLabel ?? alt}</span>
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
      {...rest}
    />
  )
}
