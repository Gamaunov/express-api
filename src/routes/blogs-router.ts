import { Router } from 'express'

import { container } from '../composition-root'
import { BlogsController } from '../controllers/BlogsController'
import {
  blogErrorsValidation,
  checkBasicMiddleware,
  postErrorsValidation,
  postValidation,
  validateBlog,
  validateObjectId,
} from '../middlewares'
import { findBlogMiddleware } from '../middlewares/blogs/findBlogMiddleware'

export const blogsRouter = Router({})
const blogsController = container.resolve(BlogsController)

blogsRouter.get(`/`, blogsController.getAllBlogs.bind(blogsController))

blogsRouter.get(
  `/:id`,
  validateObjectId,
  blogsController.getBlog.bind(blogsController),
)

blogsRouter.get(
  `/:blogId/posts`,
  findBlogMiddleware,
  blogsController.getPosts.bind(blogsController),
)

blogsRouter.post(
  `/`,
  checkBasicMiddleware,
  validateBlog(),
  blogErrorsValidation,
  blogsController.createBlog.bind(blogsController),
)

blogsRouter.post(
  `/:blogId/posts`,
  checkBasicMiddleware,
  findBlogMiddleware,
  postValidation(),
  postErrorsValidation,
  blogsController.createPost.bind(blogsController),
)

blogsRouter.put(
  `/:id`,
  validateObjectId,
  checkBasicMiddleware,
  validateBlog(),
  blogErrorsValidation,
  blogsController.updateBlog.bind(blogsController),
)

blogsRouter.delete(
  `/:id`,
  validateObjectId,
  checkBasicMiddleware,
  blogsController.deleteBlog.bind(blogsController),
)

blogsRouter.delete(
  '/',
  checkBasicMiddleware,
  blogsController.deleteBlogs.bind(blogsController),
)
