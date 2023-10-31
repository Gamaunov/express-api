import express, { Response } from 'express'

import { commentsService } from '../domain/comments-service'
import { postsService } from '../domain/post-service'
import {
  CommentErrorsValidation,
  FindPostMiddleware,
  PostErrorsValidation,
  PostValidation,
  ValidateComment,
  authBasicMiddleware,
  authGuardMiddleware,
  validateObjectId,
} from '../middlewares'
import {
  CommentQueryModel,
  CreateCommentModel,
  CreatePostModel,
  MappedCommentModel,
  PaginatorCommentModel,
  PaginatorPostModel,
  PostOutputModel,
  PostQueryModel,
  PostViewModel,
  URIParamsPostModel,
} from '../models'
import { commentsQueryRepository } from '../reposotories/query-repositories/comments-query-repository'
import { postsQueryRepository } from '../reposotories/query-repositories/posts-query-repository'
import {
  PostIdType,
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  RequestWithQuery,
} from '../shared'

export const postsRouter = () => {
  const router = express.Router()

  router.get(
    `/`,
    async (req: RequestWithQuery<PostQueryModel>, res: Response) => {
      const data: PostQueryModel = req.query

      const posts: PaginatorPostModel | null =
        await postsQueryRepository.getAllPosts(data)

      return res.status(200).send(posts)
    },
  )

  router.get(
    `/:id`,
    validateObjectId,
    async (
      req: RequestWithParams<URIParamsPostModel>,
      res: Response,
    ): Promise<void> => {
      const post: PostOutputModel | null =
        await postsQueryRepository.getPostById(req.params.id)

      post ? res.status(200).send(post) : res.sendStatus(404)
    },
  )

  router.post(
    `/`,
    authBasicMiddleware,
    PostValidation(),
    PostErrorsValidation,
    async (req: RequestWithBody<CreatePostModel>, res: Response) => {
      const data: CreatePostModel = req.body

      const newPost: PostViewModel | null = await postsService.createPost(data)

      return newPost ? res.status(201).send(newPost) : res.sendStatus(404)
    },
  )

  router.get(
    `/:postId/comments`,
    FindPostMiddleware,
    async (
      req: RequestWithParamsAndBody<PostIdType, CommentQueryModel>,
      res: Response,
    ) => {
      const data = req.query

      const commentsByPostId: PaginatorCommentModel | null =
        await commentsQueryRepository.getCommentsByPostId(
          req.params.postId,
          data,
        )

      return res.status(200).send(commentsByPostId)
    },
  )

  router.post(
    `/:postId/comments`,
    authBasicMiddleware,
    FindPostMiddleware,
    ValidateComment(),
    CommentErrorsValidation,
    async (
      req: RequestWithParamsAndBody<PostIdType, CreateCommentModel>,
      res: Response,
    ) => {
      const data: CreateCommentModel = req.body

      if (!req.user) return res.sendStatus(401)

      const userInfo = {
        userId: req.user._id,
        userLogin: req.user.accountData.login,
      }

      const createdCommentByPostId: MappedCommentModel =
        await commentsService.createCommentByPostId(
          req.params.postId,
          userInfo,
          data,
        )

      return res.status(201).send(createdCommentByPostId)
    },
  )

  router.put(
    `/:id`,
    validateObjectId,
    authBasicMiddleware,
    PostValidation(),
    PostErrorsValidation,
    async (
      req: RequestWithParamsAndBody<URIParamsPostModel, CreatePostModel>,
      res: Response,
    ): Promise<void> => {
      const { blogId, content, shortDescription, title } = req.body

      const isUpdated: PostOutputModel | null = await postsService.updatePost(
        req.params.id,
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
      const isDeleted: boolean = await postsService.deletePost(req.params.id)

      isDeleted ? res.sendStatus(204) : res.sendStatus(404)
    },
  )

  return router
}
