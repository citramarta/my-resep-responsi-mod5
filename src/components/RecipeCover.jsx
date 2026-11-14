import { useState } from 'react'

export default function RecipeCover({ src, alt = '', fallback }) {
  const [failedSrc, setFailedSrc] = useState(null)
  if (!src || failedSrc === src) return fallback
  return <img className="cover-img" src={src} alt={alt} loading="lazy" onError={() => setFailedSrc(src)} />
}