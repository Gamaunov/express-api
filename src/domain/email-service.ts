import { emailManager } from '../managers/email-manager'

export const emailService = {
  async doOperation(
    email: string,
    subject: string,
    message: string,
  ): Promise<void> {
    return await emailManager.sendPasswordRecoveryMessage(
      email,
      subject,
      message,
    )
  },
}
