/** Normalize Firestore/string dates to { year, month } (1-12) */
export function getYearMonth(value) {
  if (!value) return null;

  let date;
  if (typeof value === 'string') {
    date = new Date(value);
  } else if (value instanceof Date) {
    date = value;
  } else if (typeof value === 'object') {
    if (typeof value.toDate === 'function') {
      date = value.toDate();
    } else if (value._seconds) {
      date = new Date(value._seconds * 1000);
    } else if (value.seconds) {
      date = new Date(value.seconds * 1000);
    }
  }

  if (!date || Number.isNaN(date.getTime())) return null;

  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
  };
}

export function toMillis(value) {
  const ym = getYearMonth(value);
  if (!ym) return 0;
  let date;
  if (typeof value === 'string') date = new Date(value);
  else if (value?.toDate) date = value.toDate();
  else if (value?._seconds) date = new Date(value._seconds * 1000);
  else date = new Date(value);
  return date?.getTime?.() || 0;
}
