import { useEffect, useState, useMemo } from 'react';
import api from '../../services/api';
import { filterByMonth, countByStatus, getYearMonth } from '../../utils/dateHelper';

const MONTHS = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
];

const STATUS_CONFIG = [
  { key: 'new', label: 'New', color: '#3B82F6' },
  { key: 'reviewing', label: 'Reviewing', color: '#F59E0B' },
  { key: 'shortlisted', label: 'Shortlisted', color: '#EAB308' },
  { key: 'interviewed', label: 'Interviewed', color: '#A855F7' },
  { key: 'hired', label: 'Hired', color: '#10B981' },
  { key: 'rejected', label: 'Rejected', color: '#EF4444' },
];

const currentYear = new Date().getFullYear();
const YEARS = [currentYear - 1, currentYear, currentYear + 1];

function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? '0' : '1';
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y} Z`;
}

function PieChart({ slices, size = 200 }) {
  const total = slices.reduce((s, d) => s + d.value, 0);
  if (total === 0) {
    return (
      <div className="flex items-center justify-center rounded-full bg-slate-100" style={{ width: size, height: size }}>
        <span className="text-slate-400 text-sm">No data</span>
      </div>
    );
  }

  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 4;
  let angle = 0;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {slices.filter((s) => s.value > 0).map((slice) => {
        const sweep = (slice.value / total) * 360;
        const start = angle;
        angle += sweep;
        if (sweep >= 359.99) {
          return <circle key={slice.key} cx={cx} cy={cy} r={r} fill={slice.color} />;
        }
        return (
          <path
            key={slice.key}
            d={describeArc(cx, cy, r, start, start + sweep)}
            fill={slice.color}
            stroke="#fff"
            strokeWidth="2"
          />
        );
      })}
      <circle cx={cx} cy={cy} r={r * 0.45} fill="white" />
      <text x={cx} y={cy - 6} textAnchor="middle" className="fill-navy-900" fontSize="22" fontWeight="bold">
        {total}
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle" className="fill-slate-500" fontSize="11">
        Resumes
      </text>
    </svg>
  );
}

const STATUS_KEYS = STATUS_CONFIG.map((s) => s.key);

export default function MonthlyResumeChart() {
  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [allApps, setAllApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadApps();
  }, []);

  const loadApps = () => {
    setLoading(true);
    setError('');
    api.applications.list()
      .then((res) => setAllApps(res.data || []))
      .catch((err) => setError(err.message || 'Failed to load data'))
      .finally(() => setLoading(false));
  };

  const filtered = useMemo(() => filterByMonth(allApps, year, month), [allApps, year, month]);

  const data = useMemo(() => {
    const byStatus = countByStatus(filtered, STATUS_KEYS);
    const availableMonths = [...new Set(
      allApps.map((a) => getYearMonth(a.createdAt)).filter(Boolean).map((ym) => `${ym.year}-${ym.month}`)
    )].sort().reverse();
    return { total: filtered.length, byStatus, availableMonths };
  }, [filtered, allApps]);

  const slices = useMemo(() => {
    if (!data?.byStatus) return [];
    return STATUS_CONFIG.map((s) => ({
      key: s.key,
      label: s.label,
      color: s.color,
      value: data.byStatus[s.key] || 0,
    }));
  }, [data]);

  const monthLabel = MONTHS.find((m) => m.value === month)?.label || '';

  return (
    <div className="bg-white rounded-2xl border border-surface-200 shadow-card p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h3 className="font-heading font-semibold text-navy-900">Monthly Resume Submissions</h3>
        <div className="flex flex-wrap gap-3">
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="px-4 py-2 rounded-xl border border-surface-200 text-sm outline-none focus:border-brand-500 bg-white cursor-pointer"
          >
            {YEARS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="px-4 py-2 rounded-xl border border-surface-200 text-sm outline-none focus:border-brand-500 bg-white cursor-pointer"
          >
            {MONTHS.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="h-48 flex items-center justify-center text-slate-400 text-sm">Loading chart...</div>
      ) : error ? (
        <div className="h-48 flex flex-col items-center justify-center gap-3 text-red-500 text-sm">
          <span>{error}</span>
          <button type="button" onClick={loadApps} className="px-4 py-2 rounded-lg bg-red-50 border border-red-100 hover:bg-red-100 font-medium cursor-pointer">
            Retry
          </button>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row items-center gap-8">
          <PieChart slices={slices} size={220} />

          <div className="flex-1 w-full space-y-3">
            <p className="text-sm text-slate-500 mb-4">
              <span className="font-semibold text-navy-900">{monthLabel} {year}</span>
              {' — '}{data?.total || 0} total resume{data?.total !== 1 ? 's' : ''} submitted
            </p>

            {data?.total === 0 && data?.availableMonths?.length > 0 && (
              <p className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mb-3">
                No resumes submitted in {monthLabel} {year}. Try:{' '}
                {data.availableMonths.slice(0, 3).map((ym) => {
                  const [y, m] = ym.split('-');
                  const label = MONTHS.find((mo) => mo.value === Number(m))?.label;
                  return (
                    <button
                      key={ym}
                      type="button"
                      onClick={() => { setYear(Number(y)); setMonth(Number(m)); }}
                      className="underline font-medium cursor-pointer mx-1"
                    >
                      {label} {y}
                    </button>
                  );
                })}
              </p>
            )}

            {STATUS_CONFIG.map((status) => {
              const count = data?.byStatus?.[status.key] || 0;
              const pct = data?.total ? Math.round((count / data.total) * 100) : 0;
              return (
                <div key={status.key} className="flex items-center gap-2 sm:gap-3">
                  <div className="flex items-center gap-2 w-24 sm:w-28 shrink-0">
                    <span
                      className="inline-block w-8 h-1 rounded-full"
                      style={{ backgroundColor: status.color }}
                    />
                    <span className="text-xs sm:text-sm text-navy-900 capitalize">{status.label}</span>
                  </div>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: status.color,
                        minWidth: count > 0 ? '4px' : '0',
                      }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-navy-900 w-8 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
