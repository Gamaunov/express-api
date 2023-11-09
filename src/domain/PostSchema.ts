import mongoose from 'mongoose'

import { PostDBModel } from '../models'

const postSchema = new mongoose.Schema<PostDBModel>({
  title: { type: String, required: true },
  shortDescription: { type: String, required: true },
  content: { type: String, required: true },
  blogId: { type: String, required: true },
  blogName: { type: String, required: true },
  createdAt: { type: String, required: true },
})

export const PostMongooseModel = mongoose.model('posts', postSchema)
