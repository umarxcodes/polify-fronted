
import { motion } from 'framer-motion';

export const Tabs = ({ tabs, activeTab, onChange, className = '' }) => {
  return (
    <div className={`flex items-center gap-1 p-1 bg-surface-100 rounded-xl ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`
            relative px-4 py-2 text-sm font-medium rounded-lg
            transition-all duration-200
            ${activeTab === tab.id
              ? 'bg-white text-surface-900 shadow-sm'
              : 'text-surface-500 hover:text-surface-700'
            }
          `}
        >
          {activeTab === tab.id && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-white rounded-lg shadow-sm"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
            />
          )}
          <span className="relative z-10">{tab.label}</span>
          {tab.badge !== undefined && (
            <span className={`relative z-10 ml-1.5 px-1.5 py-0.5 text-xs rounded-full ${
              activeTab === tab.id
                ? 'bg-brand-100 text-brand-700'
                : 'bg-surface-200 text-surface-500'
            }`}>
              {tab.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
