import { body } from 'express-validator'

export const validateBlog = [
  body('name')
    .notEmpty()
    .isString()
    .trim()
    .isLength({ min: 1, max: 15 })
    .withMessage('Invalid name'),

  body('description')
    .isString()
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Invalid description'),

  body('websiteUrl')
    .isString()
    .trim()
    .isLength({ min: 1, max: 100 })
    .matches(
      /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
    )
    .withMessage('Invalid websiteUrl'),
]
