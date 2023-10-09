import { WithId } from 'mongodb'

import { PostOutput } from '../../../../db/dbTypes'
import { PostViewModel } from '../../models/PostViewModel'

export const postMapper = (post: WithId<PostViewModel>): PostOutput => {
  return {
    id: post._id.toHexString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId,
    blogName: post.blogName,
    createdAt: post.createdAt,
  }
}
