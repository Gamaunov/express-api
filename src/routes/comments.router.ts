import { Router } from 'express'

import { container } from '../composition-root'
import { CommentsController } from '../controllers/CommentsController'
import {
  authBearerMiddleware,
  checkBasicMiddleware,
  errorsValidation,
  findCommentByCommentIdFromParams,
  likesValidation,
  tokenParser,
  validateComment,
  validateObjectId,
} from '../middlewares'

export const commentsRouter = Router({})
const commentsController = container.resolve(CommentsController)

commentsRouter.get(
  `/:id`,
  validateObjectId,
  tokenParser,
  commentsController.getComment.bind(commentsController),
)

commentsRouter.put(
  `/:id`,
  authBearerMiddleware,
  validateComment,
  errorsValidation,
  commentsController.updateComment.bind(commentsController),
)

commentsRouter.put(
  '/:commentId/like-status',
  authBearerMiddleware,
  findCommentByCommentIdFromParams,
  likesValidation,
  errorsValidation,
  commentsController.updateLikeStatus.bind(commentsController),
)

commentsRouter.delete(
  `/:id`,
  authBearerMiddleware,
  commentsController.deleteComment.bind(commentsController),
)

commentsRouter.delete(
  '/',
  checkBasicMiddleware,
  commentsController.deleteAllComments.bind(commentsController),
)
