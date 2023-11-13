import { Router } from 'express'

import { container } from '../composition-root'
import { PostsController } from '../controllers/PostsController'
import {
  authBearerMiddleware,
  checkBasicMiddleware,
  errorsValidation,
  findPostByIdFromParams,
  likesValidation,
  postValidation,
  tokenParser,
  validateComment,
  validateObjectId,
} from '../middlewares'

export const postsRouter = Router({})
const postsController = container.resolve(PostsController)

postsRouter.get(
  `/`,
  tokenParser,
  postsController.getPosts.bind(postsController),
)

postsRouter.get(
  `/:id`,
  validateObjectId,
  tokenParser,
  postsController.getPost.bind(postsController),
)

postsRouter.post(
  `/`,
  checkBasicMiddleware,
  postValidation,
  errorsValidation,
  postsController.createPost.bind(postsController),
)

postsRouter.get(
  `/:postId/comments`,
  findPostByIdFromParams,
  tokenParser,
  postsController.getComments.bind(postsController),
)

postsRouter.post(
  `/:postId/comments`,
  authBearerMiddleware,
  findPostByIdFromParams,
  validateComment,
  errorsValidation,
  postsController.createComment.bind(postsController),
)

postsRouter.put(
  `/:id`,
  validateObjectId,
  checkBasicMiddleware,
  postValidation,
  errorsValidation,
  postsController.updatePost.bind(postsController),
)

postsRouter.put(
  '/:postId/like-status',
  findPostByIdFromParams,
  authBearerMiddleware,
  likesValidation,
  errorsValidation,
  postsController.updateLikeStatus.bind(postsController),
)

postsRouter.delete(
  `/:id`,
  validateObjectId,
  checkBasicMiddleware,
  postsController.deletePost.bind(postsController),
)

postsRouter.delete(
  '/',
  checkBasicMiddleware,
  postsController.deletePosts.bind(postsController),
)
