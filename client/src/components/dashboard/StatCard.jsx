import { motion } from 'framer-motion';

export default function StatCard({ icon: Icon, label, value, change, color = 'brand' }) {
  const colors = {
    brand: 'from-brand-500 to-brand-600',
    accent: 'from-accent-500 to-cyan-500',
    green: 'from-emerald-500 to-green-600',
    purple: 'from-purple-500 to-violet-600',
    orange: 'from-orange-500 to-amber-500',
  };

  return (
    <motion.div
      className="bg-white rounded-2xl border border-surface-200 p-6 shadow-card hover:shadow-card-hover transition-all duration-300"
      whileHover={{ y: -2 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${change > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
            {change > 0 ? '+' : ''}{change}%
          </span>
        )}
      </div>
      <p className="text-3xl font-heading font-bold text-navy-900 mb-1">{value}</p>
      <p className="text-sm text-slate-500">{label}</p>
    </motion.div>
  );
}
