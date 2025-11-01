import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// Fullscreen logo transition. Plays a 7s animation then calls onComplete.
export default function LogoTransition({ onComplete }) {
  useEffect(() => {
    const t = setTimeout(() => {
      if (onComplete) onComplete()
    }, 7000)
    return () => clearTimeout(t)
  }, [onComplete])

  // Image is served from the public folder by Vite: use absolute path starting with '/'
  const src = '/file_000000003a00620a804e236b25a2ffc8.png'

  return (
    <div className="fullscreen-logo" role="status" aria-label="Loading logo">
      <img src={src} alt="MediMate" className="logo-transition" />
    </div>
  )
}
