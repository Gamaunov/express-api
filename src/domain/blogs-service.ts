import { BlogOutput } from '../db/dbTypes'
import { BlogViewModel } from '../models'
import { blogsRepository } from '../repositories/blogs-repository'

export const blogsService = {
  async getAllBlogs(): Promise<BlogOutput[]> {
    return blogsRepository.getAllBlogs()
  },

  async getBlogById(id: string): Promise<BlogOutput | null> {
    return blogsRepository.getBlogById(id)
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

    const createdBlog = await blogsRepository.createBlog(newBlog)

    return createdBlog
  },

  async updateBlog(
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
  ): Promise<BlogOutput | null> {
    let blog = await blogsRepository.updateBlog(
      id,
      name,
      description,
      websiteUrl,
    )

    return blog
  },

  async deleteBlog(id: string): Promise<boolean> {
    return blogsRepository.deleteBlog(id)
  },

  async deleteAllBlogs() {
    try {
      await blogsRepository.deleteAllBlogs()
    } catch (e) {
      console.error('Error deleting documents:', e)
    }
  },
}
