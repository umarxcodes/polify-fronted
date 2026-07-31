
import { Spinner } from '../ui/Spinner';

export const Loader = ({ text = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center gap-3 p-8">
    <Spinner size="lg" />
    {text && <p className="text-sm text-surface-500">{text}</p>}
  </div>
);

export default Loader;
