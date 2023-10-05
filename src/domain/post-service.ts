import { ObjectId, WithId } from 'mongodb'

import { postsCollection } from '../db/db'
import { PostOutput } from '../db/dbTypes'
import { PostViewModel } from '../models'
import { postsRepository } from '../repositories/posts-repository'

const postMapper = (post: WithId<PostViewModel>): PostOutput => {
  return {
    id: post._id.toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId,
    blogName: post.blogName,
    createdAt: post.createdAt,
  }
}

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

    const createdPost = await postsRepository.createPost(newPost)

    return createdPost
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
    let updatedPost = await postsRepository.updatePost(postId, postData)

    return updatedPost
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
