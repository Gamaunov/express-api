import { Container } from 'inversify'
import 'reflect-metadata'

import { AuthService } from './application/auth.service'
import { BlogsService } from './application/blogs.service'
import { CommentsService } from './application/comments.service'
import { JwtService } from './application/jwt.service'
import { PostsService } from './application/post.service'
import { RateLimitsService } from './application/rateLimit.service'
import { SecurityDevicesService } from './application/securityDevices.service'
import { UsersService } from './application/users.service'
import { AuthController } from './controllers/auth.controller'
import { BlogsController } from './controllers/blogs.controller'
import { CommentsController } from './controllers/comments.controller'
import { PostsController } from './controllers/posts.controller'
import { SecurityDevicesController } from './controllers/securityDevices.controller'
import { TestingController } from './controllers/testing.controller'
import { UsersController } from './controllers/users.controller'
import { BlogsRepository } from './infrastructure/blogs.repository'
import { CommentsRepository } from './infrastructure/comments.repository'
import { PostsRepository } from './infrastructure/posts.repository'
import { BlogsQueryRepository } from './infrastructure/query/blogs.query.repository'
import { CommentsQueryRepository } from './infrastructure/query/comments.query.repository'
import { PostsQueryRepository } from './infrastructure/query/posts.query.repository'
import { SecurityDevicesQueryRepository } from './infrastructure/query/securityDevices.query.repository'
import { UsersQueryRepository } from './infrastructure/query/users.query.repository'
import { RateLimitsRepository } from './infrastructure/rateLimits.repository'
import { SecurityDevicesRepository } from './infrastructure/securityDevices.repository'
import { UsersRepository } from './infrastructure/users.repository'

export const container = new Container()

container.bind(BlogsController).to(BlogsController)
container.bind(PostsController).to(PostsController)
container.bind(UsersController).to(UsersController)
container.bind(AuthController).to(AuthController)
container.bind(SecurityDevicesController).to(SecurityDevicesController)
container.bind(CommentsController).to(CommentsController)
container.bind(TestingController).to(TestingController)

container.bind(BlogsService).to(BlogsService)
container.bind(PostsService).to(PostsService)
container.bind(UsersService).to(UsersService)
container.bind(AuthService).to(AuthService)
container.bind(JwtService).to(JwtService)
container.bind(SecurityDevicesService).to(SecurityDevicesService)
container.bind(CommentsService).to(CommentsService)
container.bind(RateLimitsService).to(RateLimitsService)

container.bind(BlogsRepository).to(BlogsRepository)
container.bind(PostsRepository).to(PostsRepository)
container.bind(UsersRepository).to(UsersRepository)
container.bind(SecurityDevicesRepository).to(SecurityDevicesRepository)
container.bind(CommentsRepository).to(CommentsRepository)
container.bind(RateLimitsRepository).to(RateLimitsRepository)

container.bind(BlogsQueryRepository).to(BlogsQueryRepository)
container.bind(PostsQueryRepository).to(PostsQueryRepository)
container.bind(UsersQueryRepository).to(UsersQueryRepository)
container
  .bind(SecurityDevicesQueryRepository)
  .to(SecurityDevicesQueryRepository)
container.bind(CommentsQueryRepository).to(CommentsQueryRepository)
