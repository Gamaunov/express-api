import { Request, Response } from 'express'
import { inject, injectable } from 'inversify'

import { BlogsService } from '../application/blogs.service'
import { PostsService } from '../application/post.service'
import { BlogsQueryRepository } from '../infrastructure/query/blogs.query.repository'
import { PostsQueryRepository } from '../infrastructure/query/posts.query.repository'
import {
  BlogByBlogIdQueryModel,
  BlogOutputModel,
  BlogQueryModel,
  BlogViewModel,
  CreateBlogModel,
  CreatePostByBlogIdModel,
  PaginatorBlogModel,
  PaginatorPostModel,
  PostViewModel,
  URIParamsBlogModel,
} from '../models'
import { URIParamsBlogIdModel } from '../models/blog/URIParamsBlogIdModel'
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  RequestWithParamsAndQuery,
} from '../shared'

@injectable()
export class BlogsController {
  constructor(
    @inject(BlogsService) protected blogsService: BlogsService,
    @inject(BlogsQueryRepository)
    protected blogsQueryRepository: BlogsQueryRepository,
    @inject(PostsService) protected postsService: PostsService,
    @inject(PostsQueryRepository)
    protected postsQueryRepository: PostsQueryRepository,
  ) {}

  async getAllBlogs(req: RequestWithParams<BlogQueryModel>, res: Response) {
    const data = req.query

    const blogs: PaginatorBlogModel | null =
      await this.blogsQueryRepository.getAllBlogs(data)

    return res.status(200).send(blogs)
  }

  async getBlog(req: RequestWithParams<URIParamsBlogModel>, res: Response) {
    const blog: BlogOutputModel | null =
      await this.blogsQueryRepository.getBlogById(req.params.id)

    blog ? res.status(200).send(blog) : res.sendStatus(404)
  }

  async getPosts(
    req: RequestWithParamsAndQuery<
      URIParamsBlogIdModel,
      BlogByBlogIdQueryModel
    >,
    res: Response,
  ) {
    const data: BlogByBlogIdQueryModel = req.query

    const postsByBlogId: PaginatorPostModel | null =
      await this.postsQueryRepository.getPosts(
        data,
        req.user?._id,
        req.params.blogId,
      )

    return postsByBlogId
      ? res.status(200).json(postsByBlogId)
      : res.sendStatus(404)
  }

  async createBlog(req: RequestWithBody<CreateBlogModel>, res: Response) {
    const newBlog: BlogViewModel = await this.blogsService.createBlog(req.body)

    return res.status(201).json(newBlog)
  }

  async createPost(
    req: RequestWithParamsAndBody<
      URIParamsBlogIdModel,
      CreatePostByBlogIdModel
    >,
    res: Response,
  ) {
    const createdPostByBlogId: PostViewModel | null =
      await this.postsService.createPostByBlogId(req.params.blogId, req.body)

    return createdPostByBlogId
      ? res.status(201).send(createdPostByBlogId)
      : res.sendStatus(404)
  }

  async updateBlog(
    req: RequestWithParamsAndBody<URIParamsBlogModel, CreateBlogModel>,
    res: Response,
  ): Promise<void> {
    const isUpdated: boolean = await this.blogsService.updateBlog(
      req.params.id,
      req.body,
    )

    isUpdated ? res.sendStatus(204) : res.sendStatus(404)
  }
  async deleteBlog(
    req: RequestWithParams<URIParamsBlogModel>,
    res: Response,
  ): Promise<void> {
    const isDeleted: boolean = await this.blogsService.deleteBlog(req.params.id)

    isDeleted ? res.sendStatus(204) : res.sendStatus(404)
  }

  async deleteBlogs(req: Request, res: Response) {
    const isDeleted: boolean = await this.blogsService.deleteAllBlogs()
    isDeleted ? res.sendStatus(204) : res.sendStatus(404)
  }
}
