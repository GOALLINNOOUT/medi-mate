import React from 'react'

export default function Icon({ name, className = 'w-4 h-4', title }) {
  switch (name) {
    case 'home':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden={title ? 'false' : 'true'} role={title ? 'img' : undefined}>
          {title ? <title>{title}</title> : null}
          <path d="M3 10.5L12 4l9 6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5 21V11.5h14V21" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'mood':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden={title ? 'false' : 'true'} role={title ? 'img' : undefined}>
          {title ? <title>{title}</title> : null}
          <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 13s1.5 2 4 2 4-2 4-2" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 10h.01M15 10h.01" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'med':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden={title ? 'false' : 'true'} role={title ? 'img' : undefined}>
          {title ? <title>{title}</title> : null}
          <path d="M12 2v20M2 12h20" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'analytics':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden={title ? 'false' : 'true'} role={title ? 'img' : undefined}>
          {title ? <title>{title}</title> : null}
          <path d="M3 3v18h18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7 13v5M12 9v9M17 5v13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'profile':
    default:
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden={title ? 'false' : 'true'} role={title ? 'img' : undefined}>
          {title ? <title>{title}</title> : null}
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
  }
}
