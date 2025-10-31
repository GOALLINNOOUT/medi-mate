import React from 'react';
import { formField } from '../theme';

export default function FormField({ label, id, type = 'text', placeholder = '', ...props }) {
  return (
    <div className="mb-4">
      {label && <label htmlFor={id} className={formField.label}>{label}</label>}
      <input id={id} type={type} placeholder={placeholder} className={formField.input} {...props} />
    </div>
  );
}
