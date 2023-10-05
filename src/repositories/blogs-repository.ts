import { ObjectId, WithId } from 'mongodb'

import { blogsCollection } from '../db/db'
import { BlogOutput } from '../db/dbTypes'
import { BlogViewModel } from '../models'

const blogMapper = (blog: WithId<BlogViewModel>): BlogOutput => {
  return {
    id: blog._id.toString(),
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    createdAt: blog.createdAt,
    isMembership: blog.isMembership,
  }
}

export const blogsRepository = {
  async getAllBlogs(): Promise<BlogOutput[]> {
    const blogs = await blogsCollection.find({}).toArray()

    return blogs.map((b) => blogMapper(b))
  },

  async getBlogById(id: string): Promise<BlogOutput | null> {
    const blog = await blogsCollection.findOne({ _id: new ObjectId(id) })

    if (!blog) return null

    return blogMapper(blog)
  },

  async createBlog(
    name: string,
    description: string,
    websiteUrl: string,
  ): Promise<BlogViewModel> {
    const newBlog = {
      name,
      description,
      websiteUrl,
      createdAt: new Date().toISOString(),
      isMembership: false,
    }

    const res = await blogsCollection.insertOne({ ...newBlog })

    return blogMapper({ ...newBlog, _id: res.insertedId })
  },

  async updateBlog(
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
  ): Promise<BlogOutput | null> {
    let blog = await blogsCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { name, description, websiteUrl } },
    )

    if (!blog) return null

    return blogMapper(blog)
  },

  async deleteBlog(id: string): Promise<boolean> {
    const isBlogDeleted = await blogsCollection.deleteOne({
      _id: new ObjectId(id),
    })

    return isBlogDeleted.deletedCount === 1
  },

  async deleteAllBlogs() {
    try {
      await blogsCollection.deleteMany({})
    } catch (e) {
      console.error('Error deleting documents:', e)
    }
  },
}
