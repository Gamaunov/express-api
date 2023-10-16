import express, { Request, Response } from 'express'

import { postsService } from '../domain/post-service'
import {
  CommentErrorsValidation,
  FindPostMiddleware,
  PostErrorsValidation,
  PostValidation,
  ValidateComment,
  authGuardMiddleware,
  authMiddleware,
  validateObjectId,
} from '../middlewares'
import { CreatePostModel, URIParamsPostModel } from '../models'
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
} from '../shared'

export const postsRouter = () => {
  const router = express.Router()

  router.get(`/`, async (req: Request, res: Response) => {
    const data = req.query

    const posts = await postsService.getAllPosts(data)

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
      const data = req.body

      const newPost = await postsService.createPost(data)

      return res.status(201).send(newPost)
    },
  )

  router.get(
    `/:postId/comments`,
    FindPostMiddleware,
    async (req: Request, res: Response) => {
      const postId = req.params.postId

      const data = req.query

      const commentsByPostId = await postsService.getCommentsByPostId(
        postId,
        data,
      )

      return res.status(200).send(commentsByPostId)
    },
  )

  router.post(
    `/:postId/comments`,
    authMiddleware,
    FindPostMiddleware,
    ValidateComment(),
    CommentErrorsValidation,
    async (req: Request, res: Response) => {
      const postId = req.params.postId

      const data = req.body

      const userInfo = {
        //@ts-ignore
        userId: req.user._id,
        //@ts-ignore
        userLogin: req.user.login,
      }

      const createdCommentByPostId = await postsService.createCommentByPostId(
        postId,
        userInfo,
        data,
      )

      return res.status(201).send(createdCommentByPostId)
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
