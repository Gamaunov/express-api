import express from 'express'

import { db } from './db/db'
import { getVideoRouter } from './features/videos/video.router'
import { RouterPath } from './shared/utils/router-path'
import { getHomeRouter } from './routes/home'
import { getTestingRouter } from './routes/testing'

export const app = express()

app.use(express.json())

app.use(RouterPath.home, getHomeRouter())
app.use(RouterPath.videos, getVideoRouter(db))
// app.use(RouterPath.testing, getTestingRouter(db))

app.delete('/videos/testing/all-data', (req, res) => {
  db.video.length = 0
  res.send(204)
})
