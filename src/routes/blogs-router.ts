import { Router } from 'express'

import { container } from '../composition-root'
import { BlogsController } from '../controllers/BlogsController'
import {
  checkBasicMiddleware,
  errorsValidation,
  postValidation,
  tokenParser,
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
  tokenParser,
  blogsController.getPosts.bind(blogsController),
)

blogsRouter.post(
  `/`,
  checkBasicMiddleware,
  validateBlog,
  errorsValidation,
  blogsController.createBlog.bind(blogsController),
)

blogsRouter.post(
  `/:blogId/posts`,
  checkBasicMiddleware,
  findBlogMiddleware,
  postValidation,
  errorsValidation,
  blogsController.createPost.bind(blogsController),
)

blogsRouter.put(
  `/:id`,
  validateObjectId,
  checkBasicMiddleware,
  validateBlog,
  errorsValidation,
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
