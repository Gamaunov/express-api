import { body } from 'express-validator'

import { LikeStatus } from '../../shared'

export const likesValidation = [
  body('likeStatus')
    .exists()
    .isString()
    .trim()
    .isIn([LikeStatus.none, LikeStatus.like, LikeStatus.dislike])
    .withMessage('Invalid like status'),
]
