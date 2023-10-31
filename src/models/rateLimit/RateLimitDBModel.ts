export type RateLimitDBModel = {
  ip: string
  endpoint: string
  firstAttempt: number
  lastAttempt: number
  attemptsCount: number
}
