/**
 * API client for communicating with the Express backend.
 * Handles authentication headers and error responses.
 */

let getAccessTokenFn: (() => Promise<string | null>) | null = null

/**
 * Set the function used to get the current Privy access token.
 * Called once from the auth provider setup.
 */
export function setAccessTokenProvider(fn: () => Promise<string | null>) {
  getAccessTokenFn = fn
}

/**
 * Set a static token for dev mode (when Privy is not configured)
 */
export function setDevToken(token: string) {
  getAccessTokenFn = async () => token
}

export class ApiError extends Error {
  status: number
  data: any

  constructor(message: string, status: number, data?: any) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

interface FetchOptions extends Omit<RequestInit, 'body'> {
  body?: any
  authenticated?: boolean
}

/**
 * Make an API request to the backend.
 *
 * @param path - API path (e.g., '/projects/123') — will be prefixed with '/api'
 * @param options - Fetch options with auth support
 * @returns Parsed JSON response
 */
export async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const { authenticated = true, body, headers: customHeaders, ...fetchOptions } = options

  const headers: Record<string, string> = {
    ...(customHeaders as Record<string, string>),
  }

  // Add auth header if authenticated and we have a token provider
  if (authenticated && getAccessTokenFn) {
    try {
      const token = await getAccessTokenFn()
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
    } catch {
      // Silently continue without auth
    }
  }

  // Set Content-Type for JSON bodies (not for FormData)
  if (body && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }

  const url = `/api${path}`

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    let errorData: any
    try {
      errorData = await response.json()
    } catch {
      errorData = { error: response.statusText }
    }

    throw new ApiError(
      errorData?.error || `Request failed with status ${response.status}`,
      response.status,
      errorData,
    )
  }

  return response.json()
}
