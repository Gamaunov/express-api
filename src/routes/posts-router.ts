import express, { Request, Response } from 'express'

import { authGuardMiddleware } from '../middlewares/authGuardMiddleware'
import { validateObjectId } from '../middlewares/objectId-middleware'
import {
  PostErrorsValidation,
  PostValidation,
} from '../middlewares/posts/post-validation-middleware'
import { CreatePostModel } from '../models/posts/CreatPostModel'
import { URIParamsPostIdModel } from '../models/posts/URIParamsPostModel'
import { postsRepository } from '../repositories/posts-repository'
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
} from '../shared/types/types'

export const postsRouter = () => {
  const router = express.Router()

  router.get(`/`, async (req: Request, res: Response) => {
    const posts = await postsRepository.getAllPosts()

    posts ? res.status(200).send(posts) : res.sendStatus(404)
  })

  router.get(
    `/:id`,
    async (req: RequestWithParams<URIParamsPostIdModel>, res: Response) => {
      const blog = await postsRepository.getPostById(req.params.id)

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

      const newPost = await postsRepository.createPost(
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
    // validateObjectId,
    // authGuardMiddleware,
    // PostValidation(),
    // PostErrorsValidation,
    async (
      req: RequestWithParamsAndBody<URIParamsPostIdModel, CreatePostModel>,
      res: Response,
    ) => {
      const { blogId, content, shortDescription, title } = req.body
      const { id } = req.params
      const isUpdated = await postsRepository.updatePost(
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
    // validateObjectId,
    authGuardMiddleware,
    async (req: RequestWithParams<URIParamsPostIdModel>, res) => {
      const isDeleted = await postsRepository.deletePost(req.params.id)

      isDeleted ? res.sendStatus(204) : res.sendStatus(404)
    },
  )

  return router
}
