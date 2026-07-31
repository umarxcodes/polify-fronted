
import { Spinner } from '../ui/Spinner';

export const LoadingOverlay = ({ text = 'Loading...' }) => (
  <div className="absolute inset-0 z-40 flex items-center justify-center rounded-2xl bg-white/80 backdrop-blur-sm">
    <div className="flex flex-col items-center gap-3">
      <Spinner size="lg" />
      {text && <p className="text-sm text-surface-500">{text}</p>}
    </div>
  </div>
);

export default LoadingOverlay;
