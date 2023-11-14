import { inject, injectable } from 'inversify'
import { ObjectId } from 'mongodb'

import { BlogsRepository } from '../infrastructure/blogs.repository'
import { BlogDBModel, BlogViewModel, CreateBlogModel } from '../models'

@injectable()
export class BlogsService {
  constructor(
    @inject(BlogsRepository) protected blogsRepository: BlogsRepository,
  ) {}
  async createBlog(data: CreateBlogModel): Promise<BlogViewModel> {
    const newBlog: BlogDBModel = new BlogDBModel(
      new ObjectId(),
      data.name,
      data.description,
      data.websiteUrl,
      new Date().toISOString(),
      false,
    )

    return await this.blogsRepository.createBlog(newBlog)
  }

  async updateBlog(id: string, data: CreateBlogModel): Promise<boolean> {
    return await this.blogsRepository.updateBlog(id, data)
  }

  async deleteBlog(id: string): Promise<boolean> {
    return this.blogsRepository.deleteBlog(id)
  }

  async deleteAllBlogs(): Promise<boolean> {
    return await this.blogsRepository.deleteAllBlogs()
  }
}
