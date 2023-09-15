import express from 'express'

import { DBType } from '../shared/types/types'

export const getTestingRouter = (db: DBType) => {
  const router = express.Router()

  router.delete('/all-data', (req, res) => {
    db.video.length = 0

    res.send(204)
  })

  return router
}
