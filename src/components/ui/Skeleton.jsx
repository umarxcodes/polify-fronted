

export const Skeleton = ({ className = '', variant = 'rectangular', ...props }) => {
  const variants = {
    rectangular: 'rounded-xl',
    circular: 'rounded-full',
    text: 'rounded-lg h-4',
  };

  return (
    <div
      className={`
        ${variants[variant]}
        bg-gradient-to-r from-surface-200 via-surface-100 to-surface-200
        bg-[length:200%_100%]
        animate-[skeleton-loading_1.5s_ease-in-out_infinite]
        ${className}
      `}
      {...props}
    />
  );
};

export const SkeletonCard = () => (
  <div className="p-6 space-y-4">
    <div className="flex items-center gap-3">
      <Skeleton variant="circular" className="w-10 h-10" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
    <Skeleton className="h-32 w-full" />
    <div className="flex gap-2">
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-8 w-20" />
    </div>
  </div>
);

export const SkeletonList = ({ count = 3 }) => (
  <div className="space-y-4">
    {[...Array(count)].map((_, i) => (
      <div key={i} className="p-4 bg-white rounded-2xl border border-surface-200">
        <SkeletonCard />
      </div>
    ))}
  </div>
);

export default Skeleton;
