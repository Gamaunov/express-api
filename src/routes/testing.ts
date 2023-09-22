import express from 'express'

import { blogsRepository } from '../repositories/blogs-repository'
import { postsRepository } from '../repositories/posts-repository'
import { DBType } from '../shared/types/types'
import { HTTP_STATUSES } from '../shared/utils/http-statuses'

export const getTestingRouter = (db: DBType) => {
  const router = express.Router()

  router.delete('/all-data', (req, res) => {
    // postRepository.deleteAllPosts()
    blogsRepository.deleteAllBlogs()
    postsRepository.deleteAllPosts()
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
  })

  return router
}
