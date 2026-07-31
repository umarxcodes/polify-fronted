import { useState } from "react";
import { adminService } from "../services/adminService";

export const useAdmin = () => {
  const [stats, setStats] = useState(null);
  const [users] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getAdminStats();
      setStats(data);
      return data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { stats, users, fetchStats, loading, error };
};
