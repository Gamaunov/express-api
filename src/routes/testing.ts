import express from 'express'

import { blogsRepository } from '../repositories/blogs-repository'
import { postsRepository } from '../repositories/posts-repository'

export const getTestingRouter = () => {
  const router = express.Router()

  router.delete('/all-data', (req, res) => {
    blogsRepository.deleteAllBlogs()
    postsRepository.deleteAllPosts()

    res.sendStatus(204)
  })

  return router
}
