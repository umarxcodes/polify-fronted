import { apiClient } from '../../../lib/axios'
import { normalizeUserResponse } from '../../../utils/apiResponse'

export const getSettings = async () => {
  const response = await apiClient.get('/users/me')
  return normalizeUserResponse(response.data)
}

export const updateSettings = async (payload) => {
  const response = await apiClient.patch('/users/profile', payload)
  return normalizeUserResponse(response.data)
}

export const changePassword = async (payload) => {
  const { data } = await apiClient.patch('/auth/change-password', payload)
  return data
}
