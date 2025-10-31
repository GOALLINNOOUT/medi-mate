/* eslint-env node */
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        'primary-light': 'var(--color-primary-light)',
        secondary: 'var(--color-secondary)',
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        border: 'var(--color-border)',
        error: 'var(--color-error)',
        warning: 'var(--color-warning)',
        info: 'var(--color-info)',
        success: 'var(--color-success)'
      },
      borderRadius: {
        lg: '12px',
        xl: '16px'
      },
      boxShadow: {
        card: '0 6px 18px rgba(16,24,40,0.06)'
      },
      fontSize: {
        h1: ['28px', '1.15'],
        h2: ['22px', '1.2'],
        body: ['16px', '1.5'],
        caption: ['12px', '1.3']
      }
    }
  },
  plugins: []
};
