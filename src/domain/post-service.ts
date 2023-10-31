import { ObjectId } from 'mongodb'

import {
  BlogOutputModel,
  CreatePostByBlogIdModel,
  CreatePostModel,
  PostOutputModel,
  PostViewModel,
  UpdatePostModel,
} from '../models'
import { postsRepository } from '../reposotories/posts-repository'
import { blogsQueryRepository } from '../reposotories/query-repositories/blogs-query-repository'

export const postsService = {
  async createPost(data: CreatePostModel): Promise<PostViewModel | null> {
    const blog: BlogOutputModel | null = await blogsQueryRepository.getBlogById(
      data.blogId,
    )

    if (!blog) return null

    const newPost = {
      _id: new ObjectId(),
      title: data.title,
      shortDescription: data.shortDescription,
      content: data.content,
      blogId: data.blogId,
      blogName: blog!.name,
      createdAt: new Date().toISOString(),
    }

    return await postsRepository.createPost(newPost)
  },

  async createPostByBlogId(
    blogId: string,
    data: CreatePostByBlogIdModel,
  ): Promise<PostViewModel | null> {
    const searchedBlog: BlogOutputModel | null =
      await blogsQueryRepository.getBlogById(blogId)

    if (!searchedBlog) return null

    const newPost = {
      _id: new ObjectId(),
      title: data.title,
      shortDescription: data.shortDescription,
      content: data.content,
      blogId: blogId,
      blogName: searchedBlog.name,
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
  ): Promise<PostOutputModel | null> {
    const postId = id
    const postData: UpdatePostModel = {
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

  async deleteAllPosts(): Promise<void> {
    try {
      await postsRepository.deleteAllPosts()
    } catch (e) {
      console.error('Error deleting documents:', e)
    }
  },
}
