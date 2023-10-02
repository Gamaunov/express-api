import express, { Request, Response } from 'express'

import { authGuardMiddleware } from '../middlewares/index'
import { BlogErrorsValidation, ValidateBlog } from '../middlewares/index'
import { validateObjectId } from '../middlewares/index'
import { CreateBlogModel } from '../models/index'
import { URIParamsBlogIdModel } from '../models/index'
import { blogsRepository } from '../repositories/blogs-repository'
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
} from '../shared/index'

export const blogsRouter = () => {
  const router = express.Router()

  router.get(`/`, async (req: Request, res: Response) => {
    const blogs = await blogsRepository.getAllBlogs()
    blogs ? res.status(200).send(blogs) : res.sendStatus(404)
  })

  router.get(
    `/:id`,
    validateObjectId,
    async (req: RequestWithParams<URIParamsBlogIdModel>, res: Response) => {
      const blog = await blogsRepository.getBlogById(req.params.id)

      blog ? res.status(200).send(blog) : res.sendStatus(404)
    },
  )

  router.post(
    `/`,
    authGuardMiddleware,
    ValidateBlog(),
    BlogErrorsValidation,
    async (req: RequestWithBody<CreateBlogModel>, res: Response) => {
      const { name, description, websiteUrl } = req.body

      const newBlog = await blogsRepository.createBlog(
        name,
        description,
        websiteUrl,
      )

      return res.status(201).send(newBlog)
    },
  )

  router.put(
    `/:id`,
    validateObjectId,
    authGuardMiddleware,
    ValidateBlog(),
    BlogErrorsValidation,
    async (
      req: RequestWithParamsAndBody<URIParamsBlogIdModel, CreateBlogModel>,
      res: Response,
    ) => {
      const { name, description, websiteUrl } = req.body

      const { id } = req.params

      const isUpdated = await blogsRepository.updateBlog(
        id,
        name,
        description,
        websiteUrl,
      )

      isUpdated ? res.sendStatus(204) : res.sendStatus(404)
    },
  )

  router.delete(
    `/:id`,
    validateObjectId,
    authGuardMiddleware,
    async (req: RequestWithParams<URIParamsBlogIdModel>, res: Response) => {
      const isDeleted = await blogsRepository.deleteBlog(req.params.id)

      isDeleted ? res.sendStatus(204) : res.sendStatus(404)
    },
  )

  return router
}
