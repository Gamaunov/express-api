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

export type UserInfoType = {
  email: string
  login: string
  userId: ObjectId
}

export interface ITokenData {
  userId: string
  iat: number
  exp: number
}

export interface IRTokenInfo {
  userId: string
  deviceId: string
  iat: number
  exp: number
}
