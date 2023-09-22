import express, { Request, Response } from 'express'

import { authGuardMiddleware } from '../middlewares/authGuardMiddleware'
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

  router.get(`/`, (req: Request, res: Response) => {
    const posts = postsRepository.getAllPosts()
    posts ? res.status(200).send(posts) : res.sendStatus(404)
  })

  router.get(
    `/:id`,
    (req: RequestWithParams<URIParamsPostIdModel>, res: Response) => {
      const blog = postsRepository.getPostById(req.params.id)
      blog ? res.status(200).send(blog) : res.sendStatus(404)
    },
  )

  router.post(
    `/`,
    authGuardMiddleware,
    PostValidation(),
    PostErrorsValidation,
    (req: RequestWithBody<CreatePostModel>, res: Response) => {
      const { blogId, content, shortDescription, title } = req.body
      const newPost = postsRepository.createPost(
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
    authGuardMiddleware,
    PostValidation(),
    PostErrorsValidation,
    (
      req: RequestWithParamsAndBody<URIParamsPostIdModel, CreatePostModel>,
      res: Response,
    ) => {
      const { blogId, content, shortDescription, title } = req.body
      const { id } = req.params
      const isUpdated = postsRepository.updatePost(
        id,
        blogId,
        content,
        shortDescription,
        title,
      )

      isUpdated ? res.sendStatus(204) : res.sendStatus(404)
    },
  )

  router.delete(`/:id`, (req: RequestWithParams<URIParamsPostIdModel>, res) => {
    const isDeleted = postsRepository.deletePost(req.params.id)

    isDeleted ? res.sendStatus(204) : res.sendStatus(404)
  })

  return router
}
