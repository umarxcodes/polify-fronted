import { useUser } from "../hooks/useUser";

const ProfilePage = () => {
  const { getProfile, loading, error } = useUser();

  return (
    <div>
      <h1>Profile</h1>
      {loading && <p>Loading...</p>}
      {error && <p>Error loading profile</p>}
      <button onClick={getProfile}>Load Profile</button>
    </div>
  );
};

export default ProfilePage;
