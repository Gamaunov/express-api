import { WithId } from 'mongodb'

import { BlogOutputModel, BlogViewModel } from '../../../models'

export const blogMapper = (blog: WithId<BlogViewModel>): BlogOutputModel => {
  return {
    id: blog._id.toHexString(),
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    createdAt: blog.createdAt,
    isMembership: blog.isMembership,
  }
}
