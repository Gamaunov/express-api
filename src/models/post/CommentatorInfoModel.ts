import { ObjectId } from 'mongodb'

export type CommentatorInfoModel = {
  userId: ObjectId
  userLogin: string
}
