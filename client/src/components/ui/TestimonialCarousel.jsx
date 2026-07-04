import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';

export default function TestimonialCarousel({ testimonials = [] }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const count = testimonials.length;

  const next = useCallback(() => {
    if (!count) return;
    setDirection(1);
    setCurrent((prev) => (prev + 1) % count);
  }, [count]);

  const prev = useCallback(() => {
    if (!count) return;
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + count) % count);
  }, [count]);

  useEffect(() => {
    if (!count) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next, count]);

  if (!count) return null;

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir < 0 ? 300 : -300, opacity: 0 }),
  };

  const t = testimonials[current];

  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="relative overflow-hidden rounded-3xl bg-white shadow-elevated border border-surface-100 p-5 sm:p-8 md:p-12 min-h-[280px] sm:min-h-[320px] flex items-center">
        <Quote className="absolute top-4 left-4 sm:top-6 sm:left-6 w-8 h-8 sm:w-12 sm:h-12 text-brand-100" />

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="w-full text-center"
          >
            <div className="flex justify-center gap-1 mb-6">
              {[...Array(t.rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
            </div>

            <p className="text-base sm:text-lg md:text-xl text-slate-700 leading-relaxed mb-6 sm:mb-8 italic max-w-2xl mx-auto">
              "{t.text}"
            </p>

            <div className="flex items-center justify-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-500 to-accent-400 flex items-center justify-center text-white font-heading font-bold text-lg">
                {t.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="text-left">
                <p className="font-heading font-semibold text-navy-900">{t.name}</p>
                <p className="text-sm text-slate-500">{t.designation || t.role}</p>
                <p className="text-sm text-brand-500 font-medium">{t.company}</p>
              </div>
            </div>

            <span className="inline-block mt-4 px-3 py-1 rounded-full text-xs font-medium bg-brand-50 text-brand-600 border border-brand-100">
              {t.type === 'client' ? '🏢 Client Review' : '👤 Candidate Review'}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <button
          onClick={prev}
          className="p-3 min-w-[44px] min-h-[44px] rounded-full bg-white shadow-card border border-surface-200 hover:shadow-card-hover hover:border-brand-200 transition-all duration-300 cursor-pointer flex items-center justify-center"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="w-5 h-5 text-navy-900" />
        </button>

        <div className="flex gap-2 items-center">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
              className={`rounded-full transition-all duration-300 cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center`}
              aria-label={`Go to testimonial ${i + 1}`}
            >
              <span className={`block rounded-full transition-all duration-300 ${
                i === current
                  ? 'w-8 h-2.5 bg-gradient-to-r from-brand-500 to-accent-400'
                  : 'w-2.5 h-2.5 bg-surface-300 hover:bg-brand-300'
              }`} />
            </button>
          ))}
        </div>

        <button
          onClick={next}
          className="p-3 min-w-[44px] min-h-[44px] rounded-full bg-white shadow-card border border-surface-200 hover:shadow-card-hover hover:border-brand-200 transition-all duration-300 cursor-pointer flex items-center justify-center"
          aria-label="Next testimonial"
        >
          <ChevronRight className="w-5 h-5 text-navy-900" />
        </button>
      </div>
    </div>
  );
}
