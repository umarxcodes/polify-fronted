
import React from 'react';

const colorVariants = {
  mint: 'from-mint-400 to-mint-600',
  violet: 'from-violet-400 to-violet-600',
  cyan: 'from-cyan-400 to-cyan-600',
  orange: 'from-orange-400 to-orange-600',
  brand: 'from-primary-400 to-primary-600',
  danger: 'from-danger-400 to-danger-600',
  success: 'from-success-400 to-success-600',
};

export const Avatar = ({ src, alt, fallback, size = 'md', color = 'brand', className = '', status, ...props }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
    xl: 'w-20 h-20 text-2xl',
  };

  return (
    <div className={`relative inline-flex flex-shrink-0 ${className}`} {...props}>
      <div
        className={`
          ${sizeClasses[size]}
          rounded-full bg-gradient-to-br ${colorVariants[color] || colorVariants.brand}
          flex items-center justify-center text-white font-bold shadow-lg
          overflow-hidden
        `}
      >
        {src ? (
          <img src={src} alt={alt} className="w-full h-full object-cover rounded-full" />
        ) : (
          fallback || alt?.charAt(0).toUpperCase() || '?'
        )}
      </div>
      {status && (
        <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
          status === 'online' ? 'bg-success-500' :
          status === 'away' ? 'bg-warning-500' :
          status === 'busy' ? 'bg-danger-500' :
          'bg-surface-300'
        }`} />
      )}
    </div>
  );
};

export const AvatarGroup = ({ children, max = 4, className = '' }) => {
  const childrenArray = React.Children.toArray(children);
  const visible = childrenArray.slice(0, max);
  const remaining = childrenArray.length - max;

  return (
    <div className={`flex -space-x-2 ${className}`}>
      {visible.map((child, index) => (
        <div key={index} className="ring-2 ring-white rounded-full">
          {child}
        </div>
      ))}
      {remaining > 0 && (
        <div className="w-10 h-10 rounded-full bg-surface-200 flex items-center justify-center text-sm font-semibold text-surface-600 ring-2 ring-white">
          +{remaining}
        </div>
      )}
    </div>
  );
};

export default Avatar;
