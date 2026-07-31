import { useAnalytics } from "../hooks/useAnalytics";

const AnalyticsPage = () => {
  const { fetchOverview, overview, loading, error } = useAnalytics();

  return (
    <div>
      <h1>Analytics</h1>
      <button onClick={fetchOverview}>Load Analytics</button>
      {loading && <p>Loading...</p>}
      {error && <p>Error loading analytics</p>}
      {overview && <pre>{JSON.stringify(overview, null, 2)}</pre>}
    </div>
  );
};

export default AnalyticsPage;
