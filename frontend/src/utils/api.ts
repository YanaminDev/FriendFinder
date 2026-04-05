const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

interface ApiRequestOptions extends RequestInit {
  headers?: Record<string, string>
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = localStorage.getItem("refreshToken")
  if (!refreshToken) {
    return null
  }

  try {
    const response = await fetch(`${API_BASE_URL}/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ refreshToken })
    })

    if (!response.ok) {
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
      return null
    }

    const data = await response.json()
    localStorage.setItem("accessToken", data.accessToken)
    localStorage.setItem("refreshToken", data.refreshToken)
    return data.accessToken
  } catch (err) {
    console.error("Token refresh failed:", err)
    return null
  }
}

export async function apiCall(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<Response> {
  let accessToken = localStorage.getItem("accessToken")

  if (!accessToken) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...options.headers
      }
    })

    return response
  }

  let response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`
    }
  })

  // If token expired, try to refresh
  if (response.status === 401) {
    const newAccessToken = await refreshAccessToken()
    if (newAccessToken) {
      response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${newAccessToken}`
        }
      })
    }
  }

  return response
}

export async function apiCallJson<T>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const response = await apiCall(endpoint, options)

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || `API error: ${response.status}`)
  }

  return response.json()
}
