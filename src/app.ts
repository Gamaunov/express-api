import express from 'express'

import { blogsRouter } from './features/blogs'
import { postsRouter } from './features/posts'
import { getHomeRouter } from './routes/home'
import { getTestingRouter } from './routes/testing'
import { RouterPath } from './shared'

export const app = express()

app.use(express.json())

app.use(RouterPath.home, getHomeRouter())
app.use(RouterPath.blogs, blogsRouter())
app.use(RouterPath.posts, postsRouter())
app.use(RouterPath.testing, getTestingRouter())
