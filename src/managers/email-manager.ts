import dotenv from 'dotenv'
import nodemailer from 'nodemailer'

import { emailAdapter } from '../adapters/emailAdapter'

dotenv.config()

export const emailManager = {
  async sendPasswordRecoveryMessage(
    email: string,
    subject: string,
    message: string,
  ) {
    return await emailAdapter.sendEmail(email, subject, message)
  },

  async sendEmailConfirmationMessage(email: string, confirmationCode: string) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    })

    async function main() {
      return await transporter.sendMail({
        from: '"Backend" <process.env.EMAIL>',
        to: email,
        subject: `Confirm email to verify your account`,
        html: `<a href='https://name.io/confirm-email?code=${confirmationCode}'>confirm</a>`,
      })
    }

    main().catch(console.error)
  },
}
