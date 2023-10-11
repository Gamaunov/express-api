import { WithId } from 'mongodb'

import { BlogOutput } from '../../../../db/dbTypes'
import { BlogViewModel } from '../../models/BlogViewModel'

export const blogMapper = (blog: WithId<BlogViewModel>): BlogOutput => {
  return {
    id: blog._id.toHexString(),
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    createdAt: blog.createdAt,
    isMembership: blog.isMembership,
  }
}
