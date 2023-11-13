import {BlogDBModel, BlogOutputModel} from '../../../models'

export const blogMapper = (blog: BlogDBModel): BlogOutputModel => {
  return {
    id: blog._id.toString(),
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    createdAt: blog.createdAt,
    isMembership: blog.isMembership,
  }
}
