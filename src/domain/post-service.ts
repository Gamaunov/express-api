import { ObjectId } from 'mongodb'

import {
  CommentQueryModel,
  CommentViewModel,
  CommentatorInfoModel,
  CreateCommentModel,
  CreatePostModel,
  MappedCommentModel,
  PaginatorCommentModel,
  PaginatorPostModel,
  PostOutputModel,
  PostQueryModel,
  PostViewModel,
} from '../models'
import { blogsRepository } from '../reposotories/blogs-repository'
import { commentsRepository } from '../reposotories/comments-repository'
import { postsRepository } from '../reposotories/posts-repository'
import { queryCommentValidator, queryPostValidator } from '../shared'

export const postsService = {
  async getAllPosts(data: PostQueryModel): Promise<PaginatorPostModel | null> {
    const queryData = queryPostValidator(data)

    return await postsRepository.getAllPosts(queryData)
  },

  async getPostById(id: string): Promise<PostOutputModel | null> {
    return postsRepository.getPostById(id)
  },

  async getCommentsByPostId(
    postId: string,
    data: CommentQueryModel,
  ): Promise<PaginatorCommentModel | null> {
    const queryData = queryCommentValidator(data)

    return await commentsRepository.getCommentsByPostId(postId, queryData)
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

  async createCommentByPostId(
    postId: string,
    userInfo: CommentatorInfoModel,
    data: CreateCommentModel,
  ): Promise<MappedCommentModel | null> {
    const newComment: CommentViewModel = {
      _id: new ObjectId(),
      postId,
      content: data.content,
      commentatorInfo: {
        userId: userInfo.userId,
        userLogin: userInfo.userLogin,
      },
      createdAt: new Date().toISOString(),
    }

    return await commentsRepository.createComment(newComment)
  },

  async updatePost(
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
  ): Promise<PostOutputModel | null> {
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
