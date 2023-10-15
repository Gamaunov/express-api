import express from 'express'

export const getHomeRouter = () => {
  const router = express.Router()

  router.get('/', (req, res) => {
    res.status(200).send('happy testing')
  })

  return router
}
