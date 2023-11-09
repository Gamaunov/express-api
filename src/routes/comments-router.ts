import { Router } from 'express'

import { container } from '../composition-root'
import { CommentsController } from '../controllers/CommentsController'
import {
  authBearerMiddleware,
  checkBasicMiddleware,
  commentErrorsValidation,
  findCommentByCommentIdFromParams,
  likesErrorsValidation,
  likesValidation,
  validateComment,
  validateObjectId,
} from '../middlewares'

export const commentsRouter = Router({})
const commentsController = container.resolve(CommentsController)

commentsRouter.get(
  `/:id`,
  validateObjectId,
  commentsController.getComment.bind(commentsController),
)

commentsRouter.put(
  `/:id`,
  authBearerMiddleware,
  validateComment(),
  commentErrorsValidation,
  commentsController.updateComment.bind(commentsController),
)

commentsRouter.put(
  '/:commentId/like-status',
  authBearerMiddleware,
  findCommentByCommentIdFromParams,
  likesValidation(),
  likesErrorsValidation,
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
