export function isEmail(value) {
  if (!value) return false
  // simple email regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export function isNonEmpty(value) {
  return !!value && String(value).trim().length > 0
}

export function isPasswordValid(value, min = 8) {
  if (!value) return false
  return String(value).length >= min
}

export function isNameValid(value) {
  if (!value) return false
  // allow letters, spaces, hyphens, and apostrophes
  return /^[A-Za-z\-\s']{1,64}$/.test(value.trim())
}
