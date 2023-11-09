import cookieParser from 'cookie-parser'
import express from 'express'

import { authRouter } from './routes/auth-router'
import { blogsRouter } from './routes/blogs-router'
import { commentsRouter } from './routes/comments-router'
import { homeRouter } from './routes/home-router'
import { postsRouter } from './routes/posts-router'
import { securityDevicesRouter } from './routes/security-devices-router'
import { testingRouter } from './routes/testing-router'
import { usersRouter } from './routes/users-router'
import { RouterPath } from './shared'

export const app = express()
app.set('trust proxy', true)

app.use(express.json())
app.use(cookieParser())

app.use(RouterPath.home, homeRouter)
app.use(RouterPath.auth, authRouter)
app.use(RouterPath.blogs, blogsRouter)
app.use(RouterPath.posts, postsRouter)
app.use(RouterPath.users, usersRouter)
app.use(RouterPath.comments, commentsRouter)
app.use(RouterPath.security_devices, securityDevicesRouter)
app.use(RouterPath.testing, testingRouter)
