import { getEnvConfig } from '@/shared/config/env'

type QueryValue = string | number | boolean

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface RequestOptions {
  method: RequestMethod
  path: string
  query?: Record<string, QueryValue>
  body?: unknown
}

interface DownloadResponse {
  blob: Blob
  fileName: string | null
}

let accessToken: string | null = null
let expiresAt: string | null = null
let sessionExpiredHandler: (() => void) | null = null
let hasTriggeredSessionExpired = false

function isTokenExpired(value: string | null): boolean {
  if (!value) {
    return false
  }

  const expirationTime = Date.parse(value)

  if (!Number.isFinite(expirationTime)) {
    return true
  }

  return Date.now() >= expirationTime
}

function triggerSessionExpired(): void {
  if (hasTriggeredSessionExpired) {
    return
  }

  hasTriggeredSessionExpired = true
  sessionExpiredHandler?.()
}

function buildUrl(path: string, query?: Record<string, QueryValue>): string {
  const { apiBaseUrl } = getEnvConfig()
  const basePath = path.startsWith('/') ? path : `/${path}`
  const url = apiBaseUrl.length > 0 ? new URL(basePath, `${apiBaseUrl}/`) : new URL(basePath, window.location.origin)

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      url.searchParams.set(key, String(value))
    })
  }

  return url.toString()
}

async function request<TResponse>({ method, path, query, body }: RequestOptions): Promise<TResponse | null> {
  if (accessToken && isTokenExpired(expiresAt)) {
    triggerSessionExpired()
    throw new Error('Session expired.')
  }

  const headers: HeadersInit = {
    Accept: 'application/json',
  }

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`
  }

  if (body) {
    headers['Content-Type'] = 'application/json'
  }

  const response = await fetch(buildUrl(path, query), {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    if (response.status === 401) {
      triggerSessionExpired()
    }

    const message = await response.text()
    throw new Error(message || `Request failed with status ${response.status}.`)
  }

  if (response.status === 204) {
    return null
  }

  const responseText = await response.text()

  if (!responseText.trim()) {
    return null
  }

  return JSON.parse(responseText) as TResponse
}

function buildRequestHeaders(body?: unknown): HeadersInit {
  const headers: HeadersInit = {
    Accept: 'application/json',
  }

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`
  }

  if (body) {
    headers['Content-Type'] = 'application/json'
  }

  return headers
}

function parseFileName(contentDisposition: string | null): string | null {
  if (!contentDisposition) {
    return null
  }

  const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i)

  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1])
  }

  const quotedMatch = contentDisposition.match(/filename="([^"]+)"/i)

  if (quotedMatch?.[1]) {
    return quotedMatch[1]
  }

  const plainMatch = contentDisposition.match(/filename=([^;]+)/i)

  if (plainMatch?.[1]) {
    return plainMatch[1].trim()
  }

  return null
}

async function download(path: string, query?: Record<string, QueryValue>): Promise<DownloadResponse> {
  if (accessToken && isTokenExpired(expiresAt)) {
    triggerSessionExpired()
    throw new Error('Session expired.')
  }

  const response = await fetch(buildUrl(path, query), {
    method: 'GET',
    headers: buildRequestHeaders(),
  })

  if (!response.ok) {
    if (response.status === 401) {
      triggerSessionExpired()
    }

    const message = await response.text()
    throw new Error(message || `Request failed with status ${response.status}.`)
  }

  return {
    blob: await response.blob(),
    fileName: parseFileName(response.headers.get('content-disposition')),
  }
}

/**
 * Executes a GET request against the backend API.
 */
export async function apiGet<TResponse>(path: string, query?: Record<string, QueryValue>): Promise<TResponse | null> {
  return request<TResponse>({ method: 'GET', path, query })
}

/**
 * Executes a GET request against the backend API and returns a downloadable file.
 */
export async function apiDownload(path: string, query?: Record<string, QueryValue>): Promise<DownloadResponse> {
  return download(path, query)
}

/**
 * Executes a POST request against the backend API.
 */
export async function apiPost<TBody, TResponse>(path: string, body: TBody): Promise<TResponse | null> {
  return request<TResponse>({ method: 'POST', path, body })
}

/**
 * Executes a PUT request against the backend API.
 */
export async function apiPut<TBody, TResponse>(path: string, body: TBody): Promise<TResponse | null> {
  return request<TResponse>({ method: 'PUT', path, body })
}

/**
 * Sets the access token used for authenticated API requests.
 */
export function setApiAccessToken(token: string | null): void {
  accessToken = token && token.trim().length > 0 ? token.trim() : null

  if (!accessToken) {
    expiresAt = null
    hasTriggeredSessionExpired = false
  }
}

/**
 * Sets the token expiration used by request interceptor validation.
 */
export function setApiTokenExpiration(value: string | null): void {
  expiresAt = value && value.trim().length > 0 ? value.trim() : null

  if (!expiresAt) {
    hasTriggeredSessionExpired = false
  }
}

/**
 * Registers forced-logout callback used when token expiration is detected.
 */
export function setApiSessionExpiredHandler(handler: (() => void) | null): void {
  sessionExpiredHandler = handler
}
