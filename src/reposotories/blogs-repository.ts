import { DeleteResult, ObjectId } from 'mongodb'
import { UpdateWriteOpResult } from 'mongoose'

import { BlogViewModel, CreateBlogModel } from '../models'
import { Blogs } from '../schemas/blogSchema'
import { blogMapper } from '../shared'

export const blogsRepository = {
  async createBlog(newBlog: BlogViewModel): Promise<BlogViewModel> {
    const blog = await Blogs.create(newBlog)

    return blogMapper(blog)
  },

  async updateBlog(id: string, data: CreateBlogModel): Promise<boolean> {
    const result: UpdateWriteOpResult = await Blogs.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name: data.name,
          description: data.description,
          websiteUrl: data.websiteUrl,
        },
      },
    )

    return result.matchedCount === 1
  },

  async deleteBlog(id: string): Promise<boolean> {
    const isBlogDeleted: DeleteResult = await Blogs.deleteOne({
      _id: new ObjectId(id),
    })

    return isBlogDeleted.deletedCount === 1
  },

  async deleteAllBlogs(): Promise<void> {
    try {
      await Blogs.deleteMany({})
    } catch (e) {
      console.error('Error deleting documents:', e)
    }
  },
}
