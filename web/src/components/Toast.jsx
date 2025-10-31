import React, { useEffect, useState } from 'react'

export default function Toast({ message, type = 'info', onClose }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!message) return
    // trigger enter animation
    setVisible(true)
    const t = setTimeout(() => {
      setVisible(false)
      setTimeout(() => onClose && onClose(), 250)
    }, 4000) // 4 seconds visible
    return () => clearTimeout(t)
  }, [message, onClose])

  if (!message) return null

  const bg = type === 'success' ? 'bg-[rgba(16,185,129,0.95)]' : type === 'error' ? 'bg-[rgba(239,68,68,0.95)]' : 'bg-[rgba(59,130,246,0.95)]'

  const icon = type === 'success' ? (
    <svg className="w-5 h-5 text-white" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414-1.414L8 11.172 4.707 7.879A1 1 0 003.293 9.293l4 4a1 1 0 001.414 0l8-8z" clipRule="evenodd" />
    </svg>
  ) : type === 'error' ? (
    <svg className="w-5 h-5 text-white" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11V5a1 1 0 10-2 0v2a1 1 0 001 1h0a1 1 0 001-1zM9 9a1 1 0 112 0v4a1 1 0 11-2 0V9z" clipRule="evenodd" />
    </svg>
  ) : (
    <svg className="w-5 h-5 text-white" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path d="M2 10a8 8 0 1116 0A8 8 0 012 10z" />
    </svg>
  )

  return (
    <div className="fixed top-5 right-5 z-50 pointer-events-none">
      <div
        role="status"
        aria-live="polite"
        className={`max-w-sm w-full pointer-events-auto rounded-lg shadow-lg text-white px-4 py-3 transform transition-all duration-200 ${bg} ${visible ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`}
      >
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">{icon}</div>
          <div className="text-sm font-semibold tracking-tight">{message}</div>
          <button
            aria-label="dismiss"
            onClick={() => { setVisible(false); setTimeout(() => onClose && onClose(), 200) }}
            className="ml-auto opacity-50 hover:opacity-80 text-xs w-6 h-6 flex items-center justify-center rounded"
            title="Dismiss"
          >
            <span className="leading-none">✕</span>
          </button>
        </div>
      </div>
    </div>
  )
}
