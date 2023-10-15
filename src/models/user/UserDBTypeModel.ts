import { ObjectId } from 'mongodb'

export type UserDBTypeModel = {
  _id: ObjectId
  login: string
  email: string
  passwordHash: string
  passwordSalt: string
  createdAt: string
}
