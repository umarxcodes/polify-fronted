import { useState } from "react";
import { userService } from "../services/userService";

export const useUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const user = await userService.getProfile();
      return user;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { getProfile, loading, error };
};
