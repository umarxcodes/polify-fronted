
import { Inbox } from 'lucide-react';
import { EmptyState } from '../ui/EmptyState';

export const NoData = ({ title = 'No data found', description }) => (
  <EmptyState icon={Inbox} title={title} description={description || "We couldn't find any matching results."} />
);

export default NoData;
