import express from 'express'

import { blogsRepository } from '../features/blogs'
import { postsRepository } from '../features/posts'

export const getTestingRouter = () => {
  const router = express.Router()

  router.delete('/all-data', async (req, res) => {
    await blogsRepository.deleteAllBlogs()
    await postsRepository.deleteAllPosts()

    res.sendStatus(204)
  })

  return router
}
