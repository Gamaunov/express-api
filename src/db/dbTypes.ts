import { ObjectId } from 'mongodb'

import { BlogViewModel } from '../models/blogs/BlogViewModel'
import { PostViewModel } from '../models/posts/PostViewModel'

// export type BlogMongoType = {
//   _id: ObjectId
//   name: string
//   description: string
//   websiteUrl: string
//   createdAt: string
//   isMembership: boolean
// }

// export type PostMongoType = {
//   _id: ObjectId
//   title: string
//   shortDescription: string
//   content: string
//   blogId: string
//   blogName?: string
//   createdAt: string
// }

export type DBType = {
  blogs: BlogViewModel[]
  posts: PostViewModel[]
}
