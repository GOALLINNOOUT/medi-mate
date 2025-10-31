import React, { useEffect } from 'react';
import { modal } from '../theme';

export default function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose();
    }
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className={modal.overlay} role="dialog" aria-modal="true">
      <div className={modal.panel}>
        <button aria-label="Close modal" onClick={onClose} className={modal.close}>
          ✕
        </button>
        {title && <h2 className="text-h2 font-semibold mb-4">{title}</h2>}
        <div>{children}</div>
      </div>
    </div>
  );
}
