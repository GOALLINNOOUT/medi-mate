import React from 'react';
import { formField } from '../theme';

export default function FormField({ label, id, type = 'text', placeholder = '', error, ...props }) {
  const inputClass = `${formField.input} ${error ? 'border-red-500 ring-1 ring-red-200' : ''}`
  return (
    <div className="mb-4">
      {label && <label htmlFor={id} className={formField.label}>{label}</label>}
      <input id={id} type={type} placeholder={placeholder} className={inputClass} {...props} />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
