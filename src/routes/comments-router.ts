import express from 'express'

export const commentsRouter = () => {
  const router = express.Router()

  // router.get(`/`, async (req: Request, res: Response) => {
  //   const data = req.query
  //
  //   const blogs = await commentsService.getAllBlogs(data)
  //
  //   return res.status(200).send(blogs)
  // })

  // router.get(
  //   `/:id`,
  //   validateObjectId,
  //   async (req: RequestWithParams<any>, res: Response) => {
  //     const blog = await commentsService.getCommentById(req.params.id)
  //
  //     blog ? res.status(200).send(blog) : res.sendStatus(404)
  //   },
  // )

  // router.post(
  //   `/`,
  //   authGuardMiddleware,
  //   ValidateBlog(),
  //   BlogErrorsValidation,
  //   async (req: RequestWithBody<CreateBlogModel>, res: Response) => {
  //     const data = req.body
  //
  //     const newBlog = await commentsService.createBlog(data)
  //
  //     return res.status(201).send(newBlog)
  //   },
  // )

  // router.get(
  //   `/:blogId/posts`,
  //   FindBlogMiddleware,
  //   async (req: Request, res: Response) => {
  //     const blogId = req.params.blogId
  //
  //     const data = req.query
  //
  //     const postsByBlogId = await commentsService.getPostsByBlogId(blogId, data)
  //
  //     return res.status(200).send(postsByBlogId)
  //   },
  // )

  // router.post(
  //   `/:blogId/posts`,
  //   async (req: Request, res: Response) => {
  //     const blogId = req.params.blogId
  //
  //     const data = req.body
  //
  //     const createdPostByBlogId = await commentsService.createPostByBlogId(
  //       blogId,
  //       data,
  //     )
  //
  //     return res.status(201).send(createdPostByBlogId)
  //   },
  // )

  // router.put(
  //   `/:id`,
  //   async (
  //     req: RequestWithParamsAndBody<any, any>,
  //     res: Response,
  //   ) => {
  //     const { name, description, websiteUrl } = req.body
  //
  //     const { id } = req.params
  //
  //     const isUpdated = await commentsService.updateComment(
  //       id,
  //       name,
  //       description,
  //       websiteUrl,
  //     )
  //
  //     isUpdated ? res.sendStatus(204) : res.sendStatus(404)
  //   },
  // )

  // router.delete(
  //   `/:id`,
  //   validateObjectId,
  //   authGuardMiddleware,
  //   async (req: RequestWithParams<any>, res: Response) => {
  //     const isDeleted = await commentsService.deleteComment(req.params.id)
  //
  //     isDeleted ? res.sendStatus(204) : res.sendStatus(404)
  //   },
  // )

  return router
}
