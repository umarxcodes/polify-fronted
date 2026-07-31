
import { motion } from 'framer-motion';

const sizes = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

export const Spinner = ({ size = 'md', className = '', color = 'brand' }) => {
  const colorClasses = {
    brand: 'text-brand-500',
    surface: 'text-surface-400',
    white: 'text-white',
  };

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className={`
        ${sizes[size]}
        ${colorClasses[color]}
        ${className}
      `}
    >
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="31.4 31.4"
          opacity="0.25"
        />
        <path
          d="M12 2a10 10 0 0 1 10 10"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </motion.div>
  );
};

export const LoadingOverlay = ({ message = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center py-20">
    <Spinner size="lg" />
    <p className="mt-4 text-sm text-surface-500">{message}</p>
  </div>
);

export const LoadingPage = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="flex flex-col items-center">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/25 mb-4">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20V10" />
          <path d="M18 20V4" />
          <path d="M6 20v-4" />
        </svg>
      </div>
      <Spinner size="md" />
      <p className="mt-3 text-sm text-surface-500">Loading Pollify...</p>
    </div>
  </div>
);

export default Spinner;
