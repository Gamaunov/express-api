import { emailManager } from '../managers/email-manager'

export const emailService = {
  async doOperation(email: string, subject: string, message: string) {
    return await emailManager.sendPasswordRecoveryMessage(
      email,
      subject,
      message,
    )
  },
}
