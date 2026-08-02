import { motion } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';
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

export const ForbiddenPage = ({ onGoBack, dark }) => {
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
              <ShieldAlert size={32} strokeWidth={1.8} />
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-danger-600 bg-danger-500/10 rounded-full px-3 py-1 mb-3">
              403
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-surface-900 dark:text-white leading-tight mb-2">
              Access Denied
            </h1>
            <p className="text-surface-500 dark:text-surface-400 text-sm sm:text-base max-w-xs mx-auto">
              You don&apos;t have permission to access this resource. Contact an administrator if you believe this is an error.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            {onGoBack ? (
              <Button variant="primary" size="md" onClick={onGoBack}>
                Go Back
              </Button>
            ) : (
              <Button variant="primary" size="md" onClick={() => window.history.back()}>
                Go Back
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

export default ForbiddenPage;
