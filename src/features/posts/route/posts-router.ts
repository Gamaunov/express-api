import express, { Request, Response } from 'express'

import { authGuardMiddleware, validateObjectId } from '../../../middlewares'
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
} from '../../../shared'
import { blogsService } from '../../blogs'
import { postsService } from '../domain/post-service'
import {
  PostErrorsValidation,
  PostValidation,
} from '../middlewares/post-validation-middleware'
import { CreatePostModel } from '../models/CreatPostModel'
import { URIParamsPostModel } from '../models/URIParamsPostModel'


export const postsRouter = () => {
  const router = express.Router()

  router.get(`/`, async (req: Request, res: Response) => {
      const data = req.query

      const posts = await blogsService.getAllBlogs(data)

      return res.status(200).send(posts)
  })

  router.get(
    `/:id`,
    validateObjectId,
    async (req: RequestWithParams<URIParamsPostModel>, res: Response) => {
      const blog = await postsService.getPostById(req.params.id)

      blog ? res.status(200).send(blog) : res.sendStatus(404)
    },
  )

  router.post(
    `/`,
    authGuardMiddleware,
    PostValidation(),
    PostErrorsValidation,
    async (req: RequestWithBody<CreatePostModel>, res: Response) => {
      const { blogId, content, shortDescription, title } = req.body

      const newPost = await postsService.createPost(
        blogId,
        content,
        shortDescription,
        title,
      )

      return res.status(201).send(newPost)
    },
  )

  router.put(
    `/:id`,
    validateObjectId,
    authGuardMiddleware,
    PostValidation(),
    PostErrorsValidation,
    async (
      req: RequestWithParamsAndBody<URIParamsPostModel, CreatePostModel>,
      res: Response,
    ) => {
      const { blogId, content, shortDescription, title } = req.body

      const { id } = req.params

      const isUpdated = await postsService.updatePost(
        id,
        title,
        shortDescription,
        content,
        blogId,
      )

      isUpdated ? res.sendStatus(204) : res.sendStatus(404)
    },
  )

  router.delete(
    `/:id`,
    validateObjectId,
    authGuardMiddleware,
    async (req: RequestWithParams<URIParamsPostModel>, res) => {
      const isDeleted = await postsService.deletePost(req.params.id)

      isDeleted ? res.sendStatus(204) : res.sendStatus(404)
    },
  )

  return router
}