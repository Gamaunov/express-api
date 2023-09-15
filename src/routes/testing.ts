import express from 'express'

import { DBType } from '../shared/types/types'
import { HTTP_STATUSES } from '../shared/utils/http-statuses'

export const getTestsRouter = (db: DBType) => {
  const router = express.Router()

  router.delete('/data', (req, res) => {
    db.video = []

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
  })

  return router
}
