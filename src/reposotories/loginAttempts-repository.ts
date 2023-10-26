import { loginAttemptsCollection } from '../db/db'

export const loginAttemptsRepository = {
  async deleteAllAttempts() {
    try {
      await loginAttemptsCollection.deleteMany({})
    } catch (e) {
      console.error('Error deleting documents:', e)
    }
  },
}
