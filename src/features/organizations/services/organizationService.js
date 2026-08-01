import {
  getOrganizations,
  getOrganization,
  createOrganization,
  updateOrganization,
  deleteOrganization,
  inviteMember,
  getMembers,
  updateMemberRole,
  removeMember,
} from "../api/organizationsApi";

export const organizationService = {
  getOrganizations,
  getOrganization,
  createOrganization,
  updateOrganization,
  deleteOrganization,
  inviteMember,
  getMembers,
  updateMemberRole,
  removeMember,
};
