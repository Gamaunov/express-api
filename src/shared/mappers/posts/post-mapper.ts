import { WithId } from 'mongodb'

import { PostOutputModel, PostViewModel } from '../../../models'

export const postMapper = (post: WithId<PostViewModel>): PostOutputModel => {
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
