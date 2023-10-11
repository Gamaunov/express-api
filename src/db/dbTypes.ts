import { WithId } from 'mongodb'

import { BlogViewModel } from '../features/blogs'
import { PostViewModel } from '../features/posts'
import { UserViewModel } from '../features/users'

export type BlogDb = WithId<BlogViewModel>
export type BlogOutput = BlogViewModel & { id: string }

export type PostDb = WithId<PostViewModel>
export type PostOutput = PostViewModel & { id: string }

export type UserDb = WithId<UserViewModel>
export type UserOutput = UserViewModel & { id: string }

export type DBType = {
  blogs: BlogViewModel[]
  posts: PostViewModel[]
  users: UserViewModel[]
}
