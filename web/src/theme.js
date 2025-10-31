// Theme helpers and recommended class names for MediMate UI
export const button = {
  base: 'inline-flex items-center justify-center rounded-lg px-4 py-2 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
  primary: 'bg-primary text-white hover:bg-primary/90',
  secondary: 'bg-transparent border border-primary text-primary hover:bg-primary/5'
};

export const card = 'bg-surface text-[var(--color-text-primary)] rounded-lg shadow-card p-4';

export const modal = {
  overlay: 'fixed inset-0 bg-black/50 flex items-center justify-center z-50',
  panel: 'bg-surface rounded-xl p-6 w-full max-w-lg shadow-lg',
  close: 'absolute top-3 right-3 text-text-secondary hover:text-text-primary'
};

export const formField = {
  label: 'block text-sm font-medium text-[var(--color-text-primary)] mb-1',
  input: 'w-full rounded-lg border border-border px-3 py-2 bg-transparent text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:ring-2 focus:ring-primary/30 focus:border-primary'
};

export default {
  button,
  card,
  modal,
  formField
};
