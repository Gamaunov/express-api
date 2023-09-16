import express from 'express'

import { DBType } from '../shared/types/types'
import { HTTP_STATUSES } from '../shared/utils/http-statuses'

export const getTestingRouter = (db: DBType) => {
  const router = express.Router()

  router.delete('/all-data', (req, res) => {
    db.video.length = 0
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
  })

  return router
}
