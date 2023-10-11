import express from 'express'

import { blogsRepository } from '../features/blogs'
import { postsRepository } from '../features/posts'
import { usersRepository } from '../features/users'

export const getTestingRouter = () => {
  const router = express.Router()

  router.delete('/all-data', async (req, res) => {
    await blogsRepository.deleteAllBlogs()
    await postsRepository.deleteAllPosts()
    await usersRepository.deleteAllUsers()

    res.sendStatus(204)
  })

  return router
}
