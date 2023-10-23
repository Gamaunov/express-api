import cookieParser from 'cookie-parser'
import express from 'express'

import { authRouter } from './routes/auth-router'
import { blogsRouter } from './routes/blogs-router'
import { commentsRouter } from './routes/comments-router'
import { emailRouter } from './routes/email-router'
import { getHomeRouter } from './routes/home-router'
import { postsRouter } from './routes/posts-router'
import { getTestingRouter } from './routes/testing-router'
import { usersRouter } from './routes/users-router'
import { RouterPath } from './shared'

export const app = express()

app.use(express.json())
app.use(cookieParser())

app.use(RouterPath.home, getHomeRouter())
app.use(RouterPath.auth, authRouter())
app.use(RouterPath.blogs, blogsRouter())
app.use(RouterPath.posts, postsRouter())
app.use(RouterPath.users, usersRouter())
app.use(RouterPath.comments, commentsRouter())
app.use(RouterPath.email, emailRouter)
app.use(RouterPath.testing, getTestingRouter())
