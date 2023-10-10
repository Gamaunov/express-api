import { PostOutput } from '../../../db/dbTypes'
import { blogsRepository } from '../../blogs'
import { queryPostValidator } from '../helpers/validators/query-post-validator'
import { CreatePostModel } from '../models/CreatPostModel'
import { PaginatorPostModel } from '../models/PaginatorPostModel'
import { PostQueryModel } from '../models/PostQueryModel'
import { PostViewModel } from '../models/PostViewModel'
import { postsRepository } from '../repository/posts-repository'

export const postsService = {
  async getAllPosts(data: PostQueryModel): Promise<PaginatorPostModel | null> {
    const queryData = queryPostValidator(data)

    return await postsRepository.getAllPosts(queryData)
  },

  async getPostById(id: string): Promise<PostOutput | null> {
    return postsRepository.getPostById(id)
  },

  async createPost(data: CreatePostModel): Promise<PostViewModel> {
    const blogName = await blogsRepository.getBlogById(data.blogId)

    const newPost = {
      title: data.title,
      shortDescription: data.shortDescription,
      content: data.content,
      blogId: data.blogId,
      blogName: blogName!.name,
      createdAt: new Date().toISOString(),
    }

    return await postsRepository.createPost(newPost)
  },

  async updatePost(
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
  ): Promise<PostOutput | null> {
    const postId = id
    const postData = {
      title,
      shortDescription,
      content,
      blogId,
    }

    return await postsRepository.updatePost(postId, postData)
  },

  async deletePost(id: string): Promise<boolean> {
    return postsRepository.deletePost(id)
  },

  async deleteAllPosts() {
    try {
      await postsRepository.deleteAllPosts()
    } catch (e) {
      console.error('Error deleting documents:', e)
    }
  },
}
