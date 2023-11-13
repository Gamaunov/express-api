import { body } from 'express-validator'

export const validateComment = [
  body('content')
    .notEmpty()
    .isString()
    .trim()
    .isLength({ min: 20, max: 300 })
    .withMessage('Invalid content'),
]
