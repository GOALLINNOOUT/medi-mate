import React, { useEffect, useRef, useState } from 'react';
import { formField } from '../theme';

export default function FormField({ label, id, type = 'text', placeholder = '', error, value, defaultValue, onChange, onFocus, onBlur, ...props }) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(Boolean(value ?? defaultValue));
  const inputRef = useRef(null);

  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  useEffect(() => {
    // support controlled components
    if (value !== undefined) setHasValue(Boolean(value));
  }, [value]);

  const visibleLabel = placeholder || label || '';

  // placeholder behavior: show placeholder only when not focused and empty; remove entirely while focused
  const placeholderText = isFocused ? '' : (hasValue ? '' : visibleLabel);

  // label floats when focused or when the field has a value
  const labelFloated = isFocused || hasValue;

  const inputClass = `${formField.input} ${isPassword ? 'pr-10' : ''} ${visibleLabel ? 'pt-5' : ''} ${error ? 'border-red-500 ring-1 ring-red-200' : ''}`;

  function handleChange(e) {
    if (value === undefined) {
      setHasValue(Boolean(e.target.value));
    }
    if (onChange) onChange(e);
  }

  return (
    <div className="mb-4">
      <div className="relative">
        <input
          id={id}
          ref={inputRef}
          type={inputType}
          placeholder={placeholderText}
          aria-label={visibleLabel}
          className={inputClass}
          onFocus={(e) => { setIsFocused(true); if (onFocus) onFocus(e); }}
          onBlur={(e) => { setIsFocused(false); if (value === undefined) setHasValue(Boolean(e.target.value)); if (onBlur) onBlur(e); }}
          onChange={handleChange}
          {...props}
        />

        {visibleLabel && (
          <label
            htmlFor={id}
            className={
              'absolute left-3 transition-all duration-150 px-1 pointer-events-none text-[var(--color-text-secondary)] ' +
              (labelFloated
                ? '-top-2 text-xs bg-surface opacity-100'
                : 'top-3 text-sm bg-transparent opacity-0')
            }
            aria-hidden={!labelFloated}
          >
            {visibleLabel}
          </label>
        )}

        {isPassword && (
          <button
            type="button"
            aria-pressed={showPassword}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            onClick={() => setShowPassword(s => !s)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
          >
            {showPassword ? (
              // eye-off icon
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5 0-9.27-3-11-7 1.17-2.67 3.4-4.8 6.23-5.74" />
                <path d="M1 1l22 22" />
                <path d="M9.88 9.88A3 3 0 0 0 14.12 14.12" />
              </svg>
            ) : (
              // eye icon
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        )}
      </div>

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
