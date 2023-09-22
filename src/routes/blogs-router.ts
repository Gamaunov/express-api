import express, { Request, Response } from 'express'

import { authGuardMiddleware } from '../middlewares/authGuardMiddleware'
import {
  ErrorsBlogValidation,
  ValidateBlog,
} from '../middlewares/blogs/blog-validation-middleware'
import { CreateBlogModel } from '../models/blogs/CreatBlogModel'
import { URIParamsBlogIdModel } from '../models/blogs/URIParamsBlogModel'
import { blogsRepository } from '../repositories/blogs-repository'
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
} from '../shared/types/types'

export const blogsRouter = () => {
  const router = express.Router()

  router.get(`/`, (req: Request, res: Response) => {
    const blogs = blogsRepository.getAllBlogs()
    blogs ? res.status(200).send(blogs) : res.sendStatus(404)
  })

  router.get(
    `/:id`,
    (req: RequestWithParams<URIParamsBlogIdModel>, res: Response) => {
      const blog = blogsRepository.getBlogById(req.params.id)
      blog ? res.status(200).send(blog) : res.sendStatus(404)
    },
  )

  router.post(
    `/`,
    authGuardMiddleware,
    ValidateBlog(),
    ErrorsBlogValidation,
    (req: RequestWithBody<CreateBlogModel>, res: Response) => {
      const { name, description, websiteUrl } = req.body
      const newBlog = blogsRepository.createBlog(name, description, websiteUrl)
      return res.status(201).send(newBlog)
    },
  )

  router.put(
    `/:id`,
    authGuardMiddleware,
    ValidateBlog(),
    ErrorsBlogValidation,
    (
      req: RequestWithParamsAndBody<URIParamsBlogIdModel, CreateBlogModel>,
      res: Response,
    ) => {
      const { name, description, websiteUrl } = req.body
      const { id } = req.params
      const isUpdated = blogsRepository.updateBlog(
        id,
        name,
        description,
        websiteUrl,
      )

      isUpdated ? res.sendStatus(204) : res.sendStatus(404)
    },
  )

  router.delete(`/:id`, (req: RequestWithParams<URIParamsBlogIdModel>, res) => {
    const isDeleted = blogsRepository.deleteBlog(req.params.id)

    isDeleted ? res.send(204) : res.send(404)
  })

  return router
}
