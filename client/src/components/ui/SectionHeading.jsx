import { motion } from 'framer-motion';
import { cn } from '../../utils/helpers';

export default function SectionHeading({
  overline,
  title,
  subtitle,
  align = 'center',
  light = false,
  className = '',
}) {
  return (
    <motion.div
      className={cn(
        'mb-16 lg:mb-20',
        align === 'center' && 'text-center',
        align === 'left' && 'text-left',
        className
      )}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {overline && (
        <span className="inline-block font-semibold text-sm tracking-[0.2em] uppercase mb-5 bg-gradient-to-r from-brand-500 to-accent-400 bg-clip-text text-transparent">
          {overline}
        </span>
      )}
      <h2
        className={cn(
          'font-heading font-bold leading-tight',
          'text-3xl md:text-4xl lg:text-5xl',
          light ? 'text-white' : 'text-navy-900',
          'mb-6'
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            'mt-6 text-lg md:text-xl max-w-3xl leading-relaxed',
            align === 'center' && 'mx-auto',
            light ? 'text-surface-300' : 'text-slate-500'
          )}
        >
          {subtitle}
        </p>
      )}
      <div className="mt-8 flex items-center gap-2 justify-center">
        <span className="h-1 w-8 rounded-full bg-brand-500" />
        <span className="h-1 w-16 rounded-full bg-gradient-to-r from-brand-500 to-accent-400" />
        <span className="h-1 w-8 rounded-full bg-accent-400" />
      </div>
    </motion.div>
  );
}
