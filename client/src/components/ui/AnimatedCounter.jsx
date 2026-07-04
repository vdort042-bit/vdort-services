import { useAnimatedCounter } from '../../hooks/useAnimatedCounter';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { formatNumber } from '../../utils/helpers';

export default function AnimatedCounter({ value, suffix = '', label, duration = 2000 }) {
  const { ref, hasIntersected } = useIntersectionObserver({ threshold: 0.3 });
  const count = useAnimatedCounter(value, duration, hasIntersected);

  const displayValue = value >= 1000 ? formatNumber(count) : count;

  return (
    <div ref={ref} className="text-center">
      <span className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold gradient-text">
        {displayValue}{suffix}
      </span>
      {label && (
        <p className="mt-2 text-surface-300 text-sm md:text-base font-medium tracking-wide">
          {label}
        </p>
      )}
    </div>
  );
}
