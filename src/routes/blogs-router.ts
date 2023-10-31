import express, { Response } from 'express'

import { blogsService } from '../domain/blogs-service'
import { postsService } from '../domain/post-service'
import {
  BlogErrorsValidation,
  PostErrorsValidation,
  PostValidation,
  ValidateBlog,
  authBasicMiddleware,
  validateObjectId,
} from '../middlewares'
import { FindBlogMiddleware } from '../middlewares/blogs/findBlogMiddleware'
import {
  BlogOutputModel,
  BlogQueryModel,
  BlogViewModel,
  CreateBlogModel,
  CreatePostByBlogIdModel,
  PaginatorBlogModel,
  PaginatorPostModel,
  PostViewModel,
  URIParamsBlogIdModel,
} from '../models'
import { blogsQueryRepository } from '../reposotories/query-repositories/blogs-query-repository'
import {
  BlogIdType,
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
} from '../shared'

export const blogsRouter = () => {
  const router = express.Router()

  router.get(
    `/`,
    async (req: RequestWithParams<BlogQueryModel>, res: Response) => {
      const data = req.query

      const blogs: PaginatorBlogModel | null =
        await blogsQueryRepository.getAllBlogs(data)

      return res.status(200).send(blogs)
    },
  )

  router.get(
    `/:id`,
    validateObjectId,
    async (req: RequestWithParams<URIParamsBlogIdModel>, res: Response) => {
      const blog: BlogOutputModel | null =
        await blogsQueryRepository.getBlogById(req.params.id)

      blog ? res.status(200).send(blog) : res.sendStatus(404)
    },
  )

  router.get(
    `/:blogId/posts`,
    FindBlogMiddleware,
    async (req: RequestWithParams<BlogIdType>, res: Response) => {
      const data = req.query

      const postsByBlogId: PaginatorPostModel | null =
        await blogsQueryRepository.getPostsByBlogId(req.params.blogId, data)

      return postsByBlogId
        ? res.status(200).send(postsByBlogId)
        : res.sendStatus(404)
    },
  )

  router.post(
    `/`,
    authBasicMiddleware,
    ValidateBlog(),
    BlogErrorsValidation,
    async (req: RequestWithBody<CreateBlogModel>, res: Response) => {
      const newBlog: BlogViewModel = await blogsService.createBlog(req.body)

      return res.status(201).send(newBlog)
    },
  )

  router.post(
    `/:blogId/posts`,
    authBasicMiddleware,
    FindBlogMiddleware,
    PostValidation(),
    PostErrorsValidation,
    async (
      req: RequestWithParamsAndBody<BlogIdType, CreatePostByBlogIdModel>,
      res: Response,
    ) => {
      const createdPostByBlogId: PostViewModel | null =
        await postsService.createPostByBlogId(req.params.blogId, req.body)

      return createdPostByBlogId
        ? res.status(201).send(createdPostByBlogId)
        : res.sendStatus(404)
    },
  )

  router.put(
    `/:id`,
    validateObjectId,
    authBasicMiddleware,
    ValidateBlog(),
    BlogErrorsValidation,
    async (
      req: RequestWithParamsAndBody<URIParamsBlogIdModel, CreateBlogModel>,
      res: Response,
    ): Promise<void> => {
      const isUpdated: boolean = await blogsService.updateBlog(
        req.params.id,
        req.body,
      )

      isUpdated ? res.sendStatus(204) : res.sendStatus(404)
    },
  )

  router.delete(
    `/:id`,
    validateObjectId,
    authBasicMiddleware,
    async (
      req: RequestWithParams<URIParamsBlogIdModel>,
      res: Response,
    ): Promise<void> => {
      const isDeleted: boolean = await blogsService.deleteBlog(req.params.id)

      isDeleted ? res.sendStatus(204) : res.sendStatus(404)
    },
  )

  return router
}
