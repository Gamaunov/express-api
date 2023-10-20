export type EmailConfirmationModel = {
  isConfirmed: boolean
  confirmationCode: string
  expirationDate: Date
}
