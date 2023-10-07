import { WithId } from 'mongodb'

import { BlogOutput } from '../../../db/dbTypes'
import { BlogViewModel } from '../../../models'

export const blogMapper = (blog: WithId<BlogViewModel>): BlogOutput => {
  return {
    id: blog._id.toString(),
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    createdAt: blog.createdAt,
    isMembership: blog.isMembership,
  }
}

export function blogsMapper(blogs: WithId<BlogViewModel>[]): BlogOutput[] {
  return blogs.map((blog) => ({
    id: blog._id.toString(),
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    createdAt: blog.createdAt,
    isMembership: blog.isMembership,
  }))
}
