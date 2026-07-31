
import { EmptyState } from '../ui/EmptyState';

export const NotFound = ({ title = 'Page not found', description }) => (
  <EmptyState
    icon="🧭"
    title={title}
    description={description || 'The page you are looking for does not exist or has been moved.'}
  />
);

export default NotFound;
