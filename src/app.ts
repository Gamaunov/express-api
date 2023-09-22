import express from 'express'

import { db } from './db/db'
import { blogsRouter } from './routes/blogs-router'
import { getHomeRouter } from './routes/home'
import { postsRouter } from './routes/posts-router'
import { getTestingRouter } from './routes/testing'
import { RouterPath } from './shared/utils/router-path'

export const app = express()

app.use(express.json())

app.use(RouterPath.home, getHomeRouter())
app.use(RouterPath.blogs, blogsRouter())
app.use(RouterPath.posts, postsRouter())
app.use(RouterPath.testing, getTestingRouter(db))
