import { apiClient } from "../../../lib/axios";

export const getProfile = async () => {
  const { data } = await apiClient.get("/users/profile");
  return data;
};

export const updateProfile = async (payload) => {
  const { data } = await apiClient.put("/users/profile", payload);
  return data;
};

export const getUserById = async (id) => {
  const { data } = await apiClient.get(`/users/${id}`);
  return data;
};
