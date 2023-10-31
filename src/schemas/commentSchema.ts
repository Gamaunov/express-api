import mongoose from 'mongoose'

import { CommentOutputModel } from '../models'

const commentSchema = new mongoose.Schema<CommentOutputModel>({
  content: { type: String, required: true },
  commentatorInfo: {
    userId: { type: String, required: true },
    userLogin: { type: String, required: true },
  },
  postId: { type: String, required: true },
  createdAt: { type: String, required: true },
})

export const Comments = mongoose.model('comments', commentSchema)
