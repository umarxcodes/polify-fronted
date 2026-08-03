import { apiClient } from "../../../lib/axios";

export const getOrganizations = async (params = {}) => {
  const { data } = await apiClient.get("/organizations", { params });
  return data?.data || data;
};

export const getOrganization = async (slug) => {
  const { data } = await apiClient.get(`/organizations/${slug}`);
  return data?.data || data;
};

export const createOrganization = async (payload) => {
  const { data } = await apiClient.post("/organizations", payload);
  return data?.data || data;
};

export const updateOrganization = async (slug, payload) => {
  const { data } = await apiClient.patch(`/organizations/${slug}`, payload);
  return data?.data || data;
};

export const deleteOrganization = async (slug) => {
  const { data } = await apiClient.delete(`/organizations/${slug}`);
  return data?.data || data;
};

export const inviteMember = async (slug, payload) => {
  const { data } = await apiClient.post(`/organizations/${slug}/members`, payload);
  return data?.data || data;
};

export const getMembers = async (slug) => {
  const { data } = await apiClient.get(`/organizations/${slug}/members`);
  return data?.data || data;
};

export const updateMemberRole = async (slug, userId, role) => {
  const { data } = await apiClient.patch(`/organizations/${slug}/members/${userId}`, { role });
  return data?.data || data;
};

export const removeMember = async (slug, userId) => {
  const { data } = await apiClient.delete(`/organizations/${slug}/members/${userId}`);
  return data?.data || data;
};
