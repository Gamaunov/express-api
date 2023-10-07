import { PostOutput } from '../db/dbTypes'
import { PostViewModel } from '../models'
import { postsRepository } from '../repositories/posts-repository'


export const postsService = {
  async getAllPosts(): Promise<PostOutput[]> {
    return postsRepository.getAllPosts()
  },

  async getPostById(id: string): Promise<PostOutput | null> {
    return postsRepository.getPostById(id)
  },

  async createPost(
    blogId: string,
    shortDescription: string,
    content: string,
    title: string,
  ): Promise<PostViewModel> {
    const newPost = {
      title,
      shortDescription,
      content,
      blogId,
      blogName: title,
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

    return  await postsRepository.updatePost(postId, postData)
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