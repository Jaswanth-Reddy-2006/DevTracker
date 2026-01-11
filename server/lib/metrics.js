import client from 'prom-client'

// Default metrics
client.collectDefaultMetrics({ timeout: 5000 })

const register = client.register

// Custom counters
const authVerifySuccess = new client.Counter({
  name: 'devtracker_auth_verify_success_total',
  help: 'Total successful auth token verifications'
})

const authVerifyFailure = new client.Counter({
  name: 'devtracker_auth_verify_failure_total',
  help: 'Total failed auth token verifications'
})

const authVerifyRevoked = new client.Counter({
  name: 'devtracker_auth_verify_revoked_total',
  help: 'Total revoked token verification attempts'
})

const rateLimitDenied = new client.Counter({
  name: 'devtracker_events_rate_limit_denied_total',
  help: 'Total denied requests to /api/events due to rate limiting'
})

export function incAuthSuccess(){ authVerifySuccess.inc() }
export function incAuthFailure(){ authVerifyFailure.inc() }
export function incAuthRevoked(){ authVerifyRevoked.inc() }
export function incRateLimitDenied(){ rateLimitDenied.inc() }
export { register }
