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
import { PostsRepository } from '../reposotories/posts-repository'
import { BlogsQueryRepository } from '../reposotories/query-repositories/blogs-query-repository'

@injectable()
export class PostsService {
  constructor(
    @inject(BlogsQueryRepository)
    protected blogsQueryRepository: BlogsQueryRepository,
    @inject(PostsRepository) protected postsRepository: PostsRepository,
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

  async deletePost(id: string): Promise<boolean> {
    return this.postsRepository.deletePost(id)
  }

  async deleteAllPosts(): Promise<boolean> {
    return this.postsRepository.deleteAllPosts()
  }
}
