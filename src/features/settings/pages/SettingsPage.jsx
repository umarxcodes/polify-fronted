import { useSettings } from "../hooks/useSettings";

const SettingsPage = () => {
  const { fetchSettings, settings, loading, error } = useSettings();

  return (
    <div>
      <h1>Settings</h1>
      <button onClick={fetchSettings}>Load Settings</button>
      {loading && <p>Loading...</p>}
      {error && <p>Error loading settings</p>}
      {settings && <pre>{JSON.stringify(settings, null, 2)}</pre>}
    </div>
  );
};

export default SettingsPage;
