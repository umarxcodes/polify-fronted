export function normalizeUserResponse(response) {
  if (!response || typeof response !== 'object') return response

  if (response.data && typeof response.data === 'object') {
    if (response.data.user && typeof response.data.user === 'object') {
      return response.data.user
    }

    if (
      response.data &&
      Object.keys(response.data).some((key) =>
        ['name', 'username', 'email', 'bio', 'location', 'website'].includes(
          key
        )
      )
    ) {
      return response.data
    }
  }

  if (response.user && typeof response.user === 'object') {
    return response.user
  }

  return response
}

export function normalizeApiResponse(response) {
  if (!response || typeof response !== 'object') return response
  if (response.data && typeof response.data === 'object') {
    return response.data
  }
  return response
}
