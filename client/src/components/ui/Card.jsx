import { motion } from 'framer-motion';
import { cn } from '../../utils/helpers';

export default function Card({
  children,
  className = '',
  variant = 'default',
  hover = true,
  gradient = false,
  onClick,
  ...props
}) {
  const baseClasses = 'rounded-2xl transition-all duration-500';

  const variantClasses = {
    default: 'bg-white border border-surface-200 shadow-card',
    glass: 'glass-light shadow-glass',
    glassDark: 'glass shadow-glass',
    navy: 'bg-navy-800 border border-navy-700 text-white',
    elevated: 'bg-white shadow-elevated border border-surface-100',
  };

  const hoverClasses = hover
    ? 'hover:shadow-card-hover hover:-translate-y-1'
    : '';

  return (
    <motion.div
      className={cn(
        baseClasses,
        variantClasses[variant],
        hoverClasses,
        gradient && 'gradient-card-border',
        onClick && 'cursor-pointer',
        className
      )}
      whileHover={hover ? { y: -4 } : {}}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  );
}
