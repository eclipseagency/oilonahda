const RIYADH_TZ = 'Asia/Riyadh'

export function riyadhNow(): Date {
  return new Date()
}

export function riyadhTodayString(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: RIYADH_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())
}

export function riyadhCurrentTimeMinutes(): number {
  const fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: RIYADH_TZ,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
  const [hh, mm] = fmt.format(new Date()).split(':').map(Number)
  return hh * 60 + mm
}

export function timeSlotToMinutes(slot: string): number {
  const [hh, mm] = slot.split(':').map(Number)
  return hh * 60 + mm
}

export function isPastDate(date: string): boolean {
  return date < riyadhTodayString()
}

export function isPastSlot(date: string, slot: string): boolean {
  const today = riyadhTodayString()
  if (date < today) return true
  if (date > today) return false
  return timeSlotToMinutes(slot) <= riyadhCurrentTimeMinutes()
}
