import { BlogViewModel } from '../models/index'
import { PostViewModel } from '../models/index'

export type DBType = {
  blogs: BlogViewModel[]
  posts: PostViewModel[]
}
