import { authRouter } from './features/auth'
import { blogsRouter } from './features/blogs'
import { postsRouter } from './features/posts'
import { usersRouter } from './features/users'
import { getHomeRouter } from './routes/home'
import { getTestingRouter } from './routes/testing'
import { RouterPath } from './shared'

export const app = require('express')().use(require('express').json())

app.use(RouterPath.home, getHomeRouter())
app.use(RouterPath.auth, authRouter())
app.use(RouterPath.blogs, blogsRouter())
app.use(RouterPath.posts, postsRouter())
app.use(RouterPath.users, usersRouter())
app.use(RouterPath.testing, getTestingRouter())
