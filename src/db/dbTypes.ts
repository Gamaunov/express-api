import { WithId } from 'mongodb'

import { BlogViewModel } from '../models/index'
import { PostViewModel } from '../models/index'

export type BlogDb = WithId<BlogViewModel>
export type BlogOutput = BlogViewModel & { id: string }

export type PostDb = WithId<PostViewModel>
export type PostOutput = PostViewModel & { id: string }

export type DBType = {
  blogs: BlogViewModel[]
  posts: PostViewModel[]
}
