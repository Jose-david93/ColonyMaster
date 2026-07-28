interface EnvConfig {
  apiBaseUrl: string
}

function sanitizeBaseUrl(value: string | undefined): string {
  const normalized = (value ?? '').trim()
  return normalized.replace(/\/+$/, '')
}

/**
 * Returns environment configuration used across the app.
 */
export function getEnvConfig(): EnvConfig {
  return {
    apiBaseUrl: sanitizeBaseUrl(import.meta.env.VITE_API_BASE_URL),
  }
}
