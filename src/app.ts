import express from 'express'

import { db } from './db/db'
import { getVideoRouter } from './features/videos/video.router'
import { getTestsRouter } from './routes/tests'
import { RouterPath } from './shared/utils/router-path'

export const app = express()

app.use(express.json())

app.use(RouterPath.videos, getVideoRouter(db))
app.use(RouterPath.__test__, getTestsRouter(db))
