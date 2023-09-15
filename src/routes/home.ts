import express from 'express'

import { HTTP_STATUSES } from '../shared/utils/http-statuses'

export const getHomeRouter = () => {
  const router = express.Router()

  router.get('/', (req, res) => {
    res.status(HTTP_STATUSES.OK_200).send('happy testing')
  })

  return router
}
