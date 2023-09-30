import { ObjectId } from 'mongodb'

import { blogsCollection, db } from '../db/db'
import { BlogType } from '../db/dbTypes'

export const blogsRepository = {
  async getAllBlogs() {
    return blogsCollection.find({}).toArray()
  },

  async getBlogById(id: string): Promise<BlogType | null> {
    const _id = new ObjectId(id)

    const blog: BlogType | null = await blogsCollection.findOne({ _id })
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
  ): Promise<BlogType> {
    const now = new Date()

    const newBlog = {
      _id: new ObjectId(),
      name: name,
      description: description,
      websiteUrl: websiteUrl,
      createdAt: now.toISOString(),
      isMembership: false,
    }

    await blogsCollection.insertOne(newBlog)

    return newBlog
  },

  async updateBlog(
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
  ): Promise<boolean> {
    const _id = new ObjectId(id)

    let isBlogUpdated = await blogsCollection.updateOne(
      { _id },
      { $set: { name, description, websiteUrl } },
    )

    return isBlogUpdated.matchedCount === 1
  },

  async deleteBlog(id: string): Promise<boolean> {
    const _id = new ObjectId(id)

    const isBlogDeleted = await blogsCollection.deleteOne({ _id })

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
