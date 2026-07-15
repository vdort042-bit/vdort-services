export function getYearMonth(value) {
  if (!value) return null;
  let date;
  if (typeof value === 'string') date = new Date(value);
  else if (value instanceof Date) date = value;
  else if (typeof value === 'object' && typeof value.toDate === 'function') date = value.toDate();
  else if (typeof value === 'object' && value._seconds) date = new Date(value._seconds * 1000);
  if (!date || Number.isNaN(date.getTime())) return null;
  return { year: date.getFullYear(), month: date.getMonth() + 1 };
}

export function filterByMonth(apps, year, month) {
  return apps.filter((app) => {
    const ym = getYearMonth(app.createdAt);
    return ym && ym.year === year && ym.month === month;
  });
}

export function countByStatus(apps, statusKeys) {
  const byStatus = Object.fromEntries(statusKeys.map((s) => [s, 0]));
  apps.forEach((app) => {
    const s = app.status || 'new';
    if (byStatus[s] !== undefined) byStatus[s]++;
    else byStatus.new++;
  });
  return byStatus;
}
