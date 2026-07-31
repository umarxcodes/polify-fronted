import { useReports } from "../hooks/useReports";

const ReportsPage = () => {
  const { fetchReports, reports, loading, error } = useReports();

  return (
    <div>
      <h1>Reports</h1>
      <button onClick={fetchReports}>Load Reports</button>
      {loading && <p>Loading...</p>}
      {error && <p>Error loading reports</p>}
      {reports && <pre>{JSON.stringify(reports, null, 2)}</pre>}
    </div>
  );
};

export default ReportsPage;
