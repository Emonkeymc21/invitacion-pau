export function formatArgentinaDate(dateIso: string) {
  const date = new Date(dateIso);
  return new Intl.DateTimeFormat('es-AR', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'America/Argentina/Buenos_Aires'
  }).format(date);
}

export function formatArgentinaReference(dateIso: string) {
  return formatArgentinaDate(dateIso);
}

export function formatLocalDate(dateIso: string) {
  const date = new Date(dateIso);
  return new Intl.DateTimeFormat('es-AR', {
    dateStyle: 'full',
    timeStyle: 'short'
  }).format(date);
}
