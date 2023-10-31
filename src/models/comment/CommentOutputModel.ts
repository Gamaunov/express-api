import { WithId } from 'mongodb'

export type CommentOutputModel = WithId<{
  content: string
  commentatorInfo: {
    userId: string
    userLogin: string
  }
  postId: string
  createdAt: string
}>
