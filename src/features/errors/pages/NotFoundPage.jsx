import { motion } from 'framer-motion';
import { SearchX } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: 'easeOut' },
  },
};

export const NotFoundPage = ({ onGoBack }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--app-bg)]">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        <div className="text-center py-10 px-6 sm:px-8 bg-white dark:bg-surface-800 rounded-2xl shadow-sm border border-surface-200 dark:border-surface-700">
          <motion.div variants={itemVariants} className="flex justify-center mb-5">
            <div className="w-16 h-16 rounded-2xl bg-info-500/10 flex items-center justify-center text-info-500">
              <SearchX size={32} strokeWidth={1.8} />
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-info-600 bg-info-500/10 rounded-full px-3 py-1 mb-3">
              404
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-surface-900 dark:text-white leading-tight mb-2">
              Page Not Found
            </h1>
            <p className="text-surface-500 dark:text-surface-400 text-sm sm:text-base max-w-xs mx-auto">
              The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            {onGoBack ? (
              <button
                onClick={onGoBack}
                className="inline-flex items-center justify-center gap-2 font-semibold rounded-xl px-4 py-2.5 bg-brand-600 text-white hover:bg-brand-700 transition-colors"
              >
                Go Back
              </button>
            ) : (
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center justify-center gap-2 font-semibold rounded-xl px-4 py-2.5 bg-brand-600 text-white hover:bg-brand-700 transition-colors"
              >
                Go Back
              </button>
            )}
            <button
              onClick={() => (window.location.href = '/')}
              className="inline-flex items-center justify-center gap-2 font-semibold rounded-xl px-4 py-2.5 bg-surface-100 dark:bg-surface-700 text-surface-900 dark:text-white hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
            >
              Go Home
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
