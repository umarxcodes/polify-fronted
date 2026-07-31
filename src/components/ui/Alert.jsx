
import { motion } from 'framer-motion';
import { Info, AlertTriangle, CheckCircle, XCircle, X } from 'lucide-react';

const variants = {
  info: { icon: Info, bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-700', iconColor: 'text-cyan-500' },
  success: { icon: CheckCircle, bg: 'bg-success-50', border: 'border-success-200', text: 'text-success-700', iconColor: 'text-success-500' },
  warning: { icon: AlertTriangle, bg: 'bg-warning-50', border: 'border-warning-200', text: 'text-warning-700', iconColor: 'text-warning-500' },
  error: { icon: XCircle, bg: 'bg-danger-50', border: 'border-danger-200', text: 'text-danger-700', iconColor: 'text-danger-500' },
};

export const Alert = ({ type = 'info', title, children, onClose, className = '' }) => {
  const config = variants[type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        relative flex gap-3 p-4 rounded-xl border
        ${config.bg} ${config.border}
        ${className}
      `}
    >
      <Icon size={20} className={`flex-shrink-0 ${config.iconColor}`} />
      <div className="flex-1">
        {title && <h4 className={`text-sm font-semibold ${config.text} mb-0.5`}>{title}</h4>}
        <p className={`text-sm ${config.text} opacity-90`}>{children}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className={`flex-shrink-0 p-1 rounded-lg hover:bg-black/5 transition-colors ${config.text}`}
        >
          <X size={16} />
        </button>
      )}
    </motion.div>
  );
};

export default Alert;
