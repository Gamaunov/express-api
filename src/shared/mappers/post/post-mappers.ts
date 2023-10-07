import { WithId } from 'mongodb'

import { PostOutput } from '../../../db/dbTypes'
import { PostViewModel } from '../../../models'

export const postMapper = (post: WithId<PostViewModel>): PostOutput => {
  return {
    id: post._id.toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId,
    blogName: post.blogName,
    createdAt: post.createdAt,
  }
}
export function postsMapper(posts: WithId<PostViewModel>[]): PostOutput[] {
  return posts.map((post) => ({
    id: post._id.toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId,
    blogName: post.blogName,
    createdAt: post.createdAt,
  }))
}
