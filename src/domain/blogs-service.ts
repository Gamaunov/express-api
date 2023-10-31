import { BlogViewModel, CreateBlogModel } from '../models'
import { blogsRepository } from '../reposotories/blogs-repository'

export const blogsService = {
  async createBlog(data: CreateBlogModel): Promise<BlogViewModel> {
    const newBlog = {
      name: data.name,
      description: data.description,
      websiteUrl: data.websiteUrl,
      createdAt: new Date().toISOString(),
      isMembership: false,
    }

    return await blogsRepository.createBlog(newBlog)
  },

  async updateBlog(id: string, data: CreateBlogModel): Promise<boolean> {
    return await blogsRepository.updateBlog(id, data)
  },

  async deleteBlog(id: string): Promise<boolean> {
    return blogsRepository.deleteBlog(id)
  },

  async deleteAllBlogs(): Promise<void> {
    try {
      await blogsRepository.deleteAllBlogs()
    } catch (e) {
      console.error('Error deleting documents:', e)
    }
  },
}
