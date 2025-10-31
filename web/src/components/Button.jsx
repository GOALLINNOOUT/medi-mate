import React from 'react';
import { button } from '../theme';

export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const variantClass = variant === 'secondary' ? button.secondary : button.primary;
  return (
    <button className={`${button.base} ${variantClass} ${className}`} {...props}>
      {children}
    </button>
  );
}
