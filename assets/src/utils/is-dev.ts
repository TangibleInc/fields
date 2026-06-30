export const isDev = (): boolean => {
  if (typeof import.meta !== 'undefined') {
    const env = (import.meta as unknown as { env?: { DEV?: boolean } }).env
    if (env != null) return env.DEV === true
  }
  return typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production'
}
