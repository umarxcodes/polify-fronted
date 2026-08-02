import { motion } from 'framer-motion';
import { ServerCrash } from 'lucide-react';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';

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

export const ServerErrorPage = ({ onRetry, dark }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--app-bg)]">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        <Card dark={dark} className="text-center py-10 px-6 sm:px-8">
          <motion.div variants={itemVariants} className="flex justify-center mb-5">
            <div className="w-16 h-16 rounded-2xl bg-danger-500/10 flex items-center justify-center text-danger-500">
              <ServerCrash size={32} strokeWidth={1.8} />
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-danger-600 bg-danger-500/10 rounded-full px-3 py-1 mb-3">
              500
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-surface-900 dark:text-white leading-tight mb-2">
              Server Error
            </h1>
            <p className="text-surface-500 dark:text-surface-400 text-sm sm:text-base max-w-xs mx-auto">
              Something went wrong on our end. We&apos;re working to fix it. Please try again in a moment.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            {onRetry && (
              <Button variant="primary" size="md" onClick={onRetry}>
                Try Again
              </Button>
            )}
            <Button variant="secondary" size="md" onClick={() => (window.location.href = '/')}>
              Go Home
            </Button>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
};

export default ServerErrorPage;
