import { RateLimitDBModel } from '../models'
import { rateLimitsRepository } from '../reposotories/rate-limits-repository'

export const rateLimitsService = {
  async findRateLimit(
    ip: string,
    endpoint: string,
  ): Promise<RateLimitDBModel | null> {
    return rateLimitsRepository.findRateLimit(ip, endpoint)
  },

  async createNewRateLimit(
    ip: string,
    endpoint: string,
  ): Promise<RateLimitDBModel> {
    const newRateLimit = {
      ip,
      endpoint,
      firstAttempt: Date.now(),
      lastAttempt: Date.now(),
      attemptsCount: 1,
    }

    return rateLimitsRepository.createRateLimit(newRateLimit)
  },

  async deleteRateLimit(ip: string, endpoint: string): Promise<boolean> {
    return rateLimitsRepository.deleteRateLimit(ip, endpoint)
  },

  async updateCounter(
    ip: string,
    endpoint: string,
    currentDate: number,
  ): Promise<boolean> {
    const rateLimit: RateLimitDBModel | null =
      await rateLimitsRepository.findRateLimit(ip, endpoint)
    if (!rateLimit) return false

    const attemptsCount: number = rateLimit.attemptsCount + 1

    return rateLimitsRepository.updateCounter(
      ip,
      endpoint,
      attemptsCount,
      currentDate,
    )
  },
}
