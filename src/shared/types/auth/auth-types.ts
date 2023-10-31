import { ObjectId } from 'mongodb'

export type ConfirmCodeType = {
  code: string
}

export type EmailType = {
  email: string
}

export type LoginType = {
  login: string
}

export type LoginOrEmailType = {
  loginOrEmail: string
  password: string
}

export type NewPasswordRecoveryInputType = {
  newPassword: 'string'
  recoveryCode: 'string'
}

export type UserInfoType = {
  email: string
  login: string
  userId: ObjectId
}

export interface ITokenPayload {
  userId: number
  deviceId: string
  iat: number
  exp: number
}

export interface IRTokenInfo {
  userId: string
  deviceId: string
  iat: number
  exp: number
}
