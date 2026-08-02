
import { motion } from 'framer-motion';
import { Inbox, SearchX, FileX, AlertTriangle } from 'lucide-react';

const icons = {
  empty: Inbox,
  notFound: SearchX,
  error: FileX,
  warning: AlertTriangle,
};

export const EmptyState = ({ type = 'empty', title, description, action, icon: CustomIcon, dark }) => {
  const Icon = CustomIcon || icons[type] || Inbox;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className={`
        w-16 h-16 rounded-2xl flex items-center justify-center mb-4
        ${type === 'error' ? 'bg-danger-500/15 text-danger-400' :
          type === 'warning' ? 'bg-warning-500/15 text-warning-400' :
          dark ? 'bg-surface-800 text-surface-500' : 'bg-surface-100 text-surface-400'}
      `}>
        <Icon size={28} />
      </div>
      <h3 className={`text-lg font-semibold mb-1 ${dark ? 'text-white' : 'text-surface-900'}`}>
        {title || (type === 'empty' ? 'Nothing here yet' :
          type === 'notFound' ? 'No results found' :
          type === 'error' ? 'Something went wrong' :
          'Warning')}
      </h3>
      <p className={`text-sm max-w-sm mb-6 ${dark ? 'text-surface-400' : 'text-surface-500'}`}>
        {description || (type === 'empty' ? 'Get started by creating your first item.' :
          type === 'notFound' ? 'Try adjusting your search or filters to find what you\'re looking for.' :
          type === 'error' ? 'An error occurred while loading this content.' :
          'Please review the information above.')}
      </p>
      {action && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={action.onClick}
          className="btn btn-primary"
        >
          {action.label}
        </motion.button>
      )}
    </motion.div>
  );
};

export default EmptyState;
