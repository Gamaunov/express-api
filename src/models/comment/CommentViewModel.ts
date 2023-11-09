import { ObjectId } from 'mongodb'

export type CommentViewModel = {
  _id: ObjectId
  postId: string
  content: string
  commentatorInfo: {
    userId: string
    userLogin: string
  }
  createdAt: string
  likesInfo: {
    likesCount: number
    dislikesCount: number
    myStatus: string
  }
}
