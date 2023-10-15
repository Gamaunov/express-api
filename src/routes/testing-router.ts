import express from 'express'

import { blogsRepository } from '../reposotories/blogs-repository'
import { commentsRepository } from '../reposotories/comments-repository'
import { postsRepository } from '../reposotories/posts-repository'
import { usersRepository } from '../reposotories/users-repository'

export const getTestingRouter = () => {
  const router = express.Router()

  router.delete('/all-data', async (req, res) => {
    await blogsRepository.deleteAllBlogs()
    await postsRepository.deleteAllPosts()
    await usersRepository.deleteAllUsers()
    await commentsRepository.deleteAllComments()

    res.sendStatus(204)
  })

  return router
}
