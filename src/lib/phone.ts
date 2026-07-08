const SAUDI_PHONE_RE = /^05\d{8}$/

export function normalizeSaudiPhone(input: string): string | null {
  if (!input || typeof input !== 'string') return null
  let p = input.replace(/[\s\-()]/g, '')
  p = p.replace(/^\+/, '')
  if (p.startsWith('00966')) p = p.slice(5)
  else if (p.startsWith('966')) p = p.slice(3)
  if (p.startsWith('5') && p.length === 9) p = '0' + p
  if (SAUDI_PHONE_RE.test(p)) return p
  return null
}

export function toIntlSaudi(phone: string): string {
  const normalized = normalizeSaudiPhone(phone)
  if (!normalized) return phone
  return '966' + normalized.slice(1)
}
