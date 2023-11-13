import { inject, injectable } from 'inversify'
import { ObjectId } from 'mongodb'

import {
  BlogOutputModel,
  CreatePostByBlogIdModel,
  CreatePostModel,
  PostDBModel,
  PostViewModel,
  UpdatePostModel,
} from '../models'
import { PostsRepository } from '../infrastructure/posts.repository'
import { BlogsQueryRepository } from '../infrastructure/query-repositories/blogsQuery.repository'
import { UsersRepository } from '../infrastructure/users.repository'
import { LikeStatus, likeSwitcher } from '../shared'

@injectable()
export class PostsService {
  constructor(
    @inject(BlogsQueryRepository)
    protected blogsQueryRepository: BlogsQueryRepository,
    @inject(PostsRepository) protected postsRepository: PostsRepository,
    @inject(UsersRepository) protected usersRepository: UsersRepository,
  ) {}
  async createPost(data: CreatePostModel): Promise<PostViewModel | null> {
    const blog: BlogOutputModel | null =
      await this.blogsQueryRepository.getBlogById(data.blogId)

    if (!blog) return null

    const newPost: PostDBModel = new PostDBModel(
      new ObjectId(),
      data.title,
      data.shortDescription,
      data.content,
      data.blogId,
      blog.name,
      new Date().toISOString(),
      {
        likesCount: 0,
        dislikesCount: 0,
        users: [],
      },
    )

    return await this.postsRepository.createPost(newPost)
  }

  async createPostByBlogId(
    blogId: string,
    data: CreatePostByBlogIdModel,
  ): Promise<PostViewModel | null> {
    const searchedBlog: BlogOutputModel | null =
      await this.blogsQueryRepository.getBlogById(blogId)

    if (!searchedBlog) return null

    const newPost: PostDBModel = new PostDBModel(
      new ObjectId(),
      data.title,
      data.shortDescription,
      data.content,
      blogId,
      searchedBlog.name,
      new Date().toISOString(),
      {
        likesCount: 0,
        dislikesCount: 0,
        users: [],
      },
    )

    return await this.postsRepository.createPost(newPost)
  }

  async updatePost(
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
  ): Promise<boolean | null> {
    const postId = id
    const postData: UpdatePostModel = {
      title,
      shortDescription,
      content,
      blogId,
    }

    return await this.postsRepository.updatePost(postId, postData)
  }

  async updateLikeStatus(
    postId: string,
    likeStatus: string,
    userId: ObjectId,
  ): Promise<boolean> {
    const foundPost = await this.postsRepository.findPostById(postId)

    if (!foundPost) {
      return false
    }

    let likesCount: number = foundPost.likesInfo.likesCount
    let dislikesCount: number = foundPost.likesInfo.dislikesCount

    const foundUser: PostDBModel | null =
      await this.postsRepository.findUserInLikesInfo(postId, userId)

    const user = await this.usersRepository.findUserById(userId)

    if (!user) {
      throw new Error('Something went wrong')
    }

    if (!foundUser) {
      await this.postsRepository.pushUserInLikesInfo(
        postId,
        userId,
        likeStatus,
        new Date().toISOString(),
        user.accountData.login,
      )

      if (likeStatus === LikeStatus.like) {
        likesCount++
      }

      if (likeStatus == LikeStatus.dislike) {
        dislikesCount++
      }

      return this.postsRepository.updateLikesCount(
        postId,
        likesCount,
        dislikesCount,
      )
    }

    let userLikeDBStatus: string | null =
      await this.postsRepository.findUserLikeStatus(postId, userId)

    const updatedLikesCount = likeSwitcher(
      userLikeDBStatus,
      likeStatus,
      likesCount,
      dislikesCount,
    )

    await this.postsRepository.updateLikesCount(
      postId,
      updatedLikesCount.likesCount,
      updatedLikesCount.dislikesCount,
    )

    return this.postsRepository.updateLikesStatus(postId, userId, likeStatus)
  }

  async deletePost(id: string): Promise<boolean> {
    return this.postsRepository.deletePost(id)
  }

  async deleteAllPosts(): Promise<boolean> {
    return this.postsRepository.deleteAllPosts()
  }
}
