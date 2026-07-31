import { apiClient } from "../../../lib/axios";

export const searchPolls = async (query, params = {}) => {
  const { data } = await apiClient.get("/search/polls", { params: { q: query, ...params } });
  return data;
};

export const searchUsers = async (query, params = {}) => {
  const { data } = await apiClient.get("/search/users", { params: { q: query, ...params } });
  return data;
};

export const getSuggestions = async (query) => {
  const { data } = await apiClient.get("/search/suggestions", { params: { q: query } });
  return data;
};
