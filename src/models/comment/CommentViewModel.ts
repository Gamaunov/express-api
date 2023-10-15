import { ObjectId } from 'mongodb'

export type CommentViewModel = {
  _id: ObjectId
  postId: string | ObjectId
  content: string
  commentatorInfo: {
    userId: string | ObjectId
    userLogin: string
  }
  createdAt: string
}
