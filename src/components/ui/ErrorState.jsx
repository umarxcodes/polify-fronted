
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

export const ErrorState = ({ error, onRetry, title = 'Something went wrong', dark }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${dark ? 'bg-danger-500/15 text-danger-400' : 'bg-danger-50 text-danger-500'}`}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h3 className={`text-lg font-semibold mb-1 ${dark ? 'text-white' : 'text-surface-900'}`}>{title}</h3>
      <p className={`text-sm max-w-sm mb-6 ${dark ? 'text-surface-400' : 'text-surface-500'}`}>
        {error || 'An unexpected error occurred. Please try again.'}
      </p>
      {onRetry && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onRetry}
          className="btn btn-primary"
        >
          <RefreshCw size={16} />
          Try again
        </motion.button>
      )}
    </motion.div>
  );
};

export default ErrorState;
