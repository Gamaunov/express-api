import mongoose from 'mongoose'

import { UserDBModel } from '../models/'

const userSchema = new mongoose.Schema<UserDBModel>({
  accountData: {
    login: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    createdAt: { type: String, required: true },
    isMembership: { type: Boolean, required: true },
  },
  emailConfirmation: {
    confirmationCode: String,
    expirationDate: Date,
    isConfirmed: { type: Boolean, required: true },
  },
  passwordRecovery: {
    recoveryCode: String,
    expirationDate: Date,
  },
})

export const Users = mongoose.model('users', userSchema)
