import { BlogOutput } from '../../../db/dbTypes'
import {
  CreatePostByBlogIdModel,
  PaginatorPostModel,
  PostViewModel,
  postsRepository,
} from '../../posts'
import { queryBlogValidator } from '../helpers/validators/query-blog-validator'
import { BlogQueryModel } from '../models/BlogQueryModel'
import { BlogViewModel } from '../models/BlogViewModel'
import { CreateBlogModel } from '../models/CreatBlogModel'
import { PaginatorBlogModel } from '../models/PaginatorBlogModel'
import { blogsRepository } from '../repository/blogs-repository'


export const blogsService = {
  async getAllBlogs(data: BlogQueryModel): Promise<PaginatorBlogModel | null> {
    const queryData = queryBlogValidator(data)

    return await blogsRepository.getAllBlogs(queryData)
  },

  async getBlogById(id: string): Promise<BlogOutput | null> {
    return blogsRepository.getBlogById(id)
  },

  async getPostsByBlogId(
    blogId: string,
    data: BlogQueryModel,
  ): Promise<PaginatorPostModel | null> {
    const queryData = queryBlogValidator(data)

    return await blogsRepository.getPostsByBlogId(blogId, queryData)
  },

  async createPostByBlogId(
    blogId: string,
    data: CreatePostByBlogIdModel,
  ): Promise<PostViewModel | null> {
    const searchedBlog = await blogsRepository.getBlogById(blogId)
    const blogName = searchedBlog?.name

    const newPost = {
      title: data.title,
      shortDescription: data.shortDescription,
      content: data.content,
      blogId: blogId,
      blogName: blogName!,
      createdAt: new Date().toISOString(),
    }

    return await postsRepository.createPost(newPost)
  },

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

  async updateBlog(
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
  ): Promise<BlogOutput | null> {
    return await blogsRepository.updateBlog(id, name, description, websiteUrl)
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