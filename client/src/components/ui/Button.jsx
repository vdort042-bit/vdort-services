import { motion } from 'framer-motion';
import { cn } from '../../utils/helpers';

const variants = {
  primary: 'bg-gradient-to-r from-brand-600 to-brand-500 text-white hover:from-brand-500 hover:to-brand-400 shadow-lg shadow-brand-600/25 hover:shadow-brand-500/40',
  secondary: 'bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:border-white/30 backdrop-blur-sm',
  outline: 'bg-transparent text-brand-500 border-2 border-brand-500 hover:bg-brand-500 hover:text-white',
  ghost: 'bg-transparent text-white/80 hover:text-white hover:bg-white/10 border border-white/15 hover:border-white/30',
  dark: 'bg-navy-900 text-white hover:bg-navy-800 border border-navy-700',
  success: 'bg-gradient-to-r from-green-600 to-emerald-500 text-white hover:from-green-500 hover:to-emerald-400 shadow-lg shadow-green-600/25',
};

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon: Icon,
  iconRight: IconRight,
  href,
  onClick,
  type = 'button',
  disabled = false,
  ...props
}) {
  const classes = cn(
    'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-300 cursor-pointer select-none',
    variants[variant],
    sizes[size],
    disabled && 'opacity-50 cursor-not-allowed',
    className
  );

  const MotionTag = href ? motion.a : motion.button;
  const linkProps = href ? { href } : { type, onClick, disabled };

  return (
    <MotionTag
      className={classes}
      whileHover={disabled ? {} : { scale: 1.02, y: -1 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      {...linkProps}
      {...props}
    >
      {Icon && <Icon className="w-5 h-5" />}
      {children}
      {IconRight && <IconRight className="w-5 h-5" />}
    </MotionTag>
  );
}
