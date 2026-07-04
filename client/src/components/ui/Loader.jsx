import { motion } from 'framer-motion';

export default function Loader({ fullScreen = false }) {
  return (
    <div className={`${fullScreen ? 'fixed inset-0 z-[9999]' : 'py-20'} flex items-center justify-center ${fullScreen ? 'gradient-hero' : ''}`}>
      <motion.div
        className="flex flex-col items-center gap-6"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="relative w-20 h-20"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-brand-400 border-r-brand-500" />
          <div className="absolute inset-2 rounded-full border-2 border-transparent border-b-accent-400 border-l-accent-500" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-heading font-bold text-white">V</span>
          </div>
        </motion.div>
        <motion.p
          className="text-surface-300 text-sm font-medium tracking-widest uppercase"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Loading
        </motion.p>
      </motion.div>
    </div>
  );
}
