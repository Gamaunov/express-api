import { ObjectId } from 'mongodb'

import { blogsCollection } from '../db/db'
import { BlogViewModel } from '../models/blogs/BlogViewModel'

export const blogsRepository = {
  async getAllBlogs() {
    // return blogsCollection.find({})
    return blogsCollection.find({}, { projection: { _id: 0 } }).toArray()
  },

  async getBlogById(id: string): Promise<BlogViewModel | null> {
    // const _id = new ObjectId(id)

    const blog: BlogViewModel | null = await blogsCollection.findOne(
      { id },
      { projection: { _id: 0 } },
    )
    return blog
  },

  // async getBlogByBlogId(id: string): Promise<BlogType | null> {
  //   const blog: BlogType | null = await blogsCollection.findOne({ id })
  //   return blog
  // },

  async createBlog(
    name: string,
    description: string,
    websiteUrl: string,
  ): Promise<BlogViewModel> {
    const newBlog = {
      id: new ObjectId().toString(),
      name: name,
      description: description,
      websiteUrl: websiteUrl,
      createdAt: new Date().toISOString(),
      isMembership: false,
    }

    await blogsCollection.insertOne(newBlog)

    const transformedResponse = {
      id: newBlog.id,
      name: newBlog.name,
      description: newBlog.description,
      websiteUrl: newBlog.websiteUrl,
      createdAt: newBlog.createdAt,
      isMembership: newBlog.isMembership,
    }

    return transformedResponse
  },

  async updateBlog(
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
  ): Promise<boolean> {
    // const _id = new ObjectId(id)

    let isBlogUpdated = await blogsCollection.updateOne(
      { id },
      { $set: { name, description, websiteUrl } },
    )

    return isBlogUpdated.matchedCount === 1
  },

  async deleteBlog(id: string): Promise<boolean> {
    // const _id = new ObjectId(id)

    const isBlogDeleted = await blogsCollection.deleteOne({ id })

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
