import mongoose from 'mongoose'

import { BlogViewModel } from '../models'

const blogSchema = new mongoose.Schema<BlogViewModel>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  websiteUrl: { type: String, required: true },
  createdAt: { type: String, required: true },
  isMembership: { type: Boolean, required: true },
})

export const Blogs = mongoose.model('blogs', blogSchema)
