import { Container } from 'inversify'
import 'reflect-metadata'

import { AuthService } from './application/auth-service'
import { BlogsService } from './application/blogs-service'
import { CommentsService } from './application/comments-service'
import { JwtService } from './application/jwtService'
import { PostsService } from './application/post-service'
import { RateLimitsService } from './application/rate-limit-service'
import { SecurityDevicesService } from './application/security-devices-service'
import { UsersService } from './application/users-service'
import { AuthController } from './controllers/AuthController'
import { BlogsController } from './controllers/BlogsController'
import { CommentsController } from './controllers/CommentsController'
import { PostsController } from './controllers/PostsController'
import { SecurityDevicesController } from './controllers/SecurityDevicesController'
import { TestingController } from './controllers/TestingController'
import { UsersController } from './controllers/UsersController'
import { BlogsRepository } from './reposotories/blogs-repository'
import { CommentsRepository } from './reposotories/comments-repository'
import { PostsRepository } from './reposotories/posts-repository'
import { BlogsQueryRepository } from './reposotories/query-repositories/blogs-query-repository'
import { CommentsQueryRepository } from './reposotories/query-repositories/comments-query-repository'
import { PostsQueryRepository } from './reposotories/query-repositories/posts-query-repository'
import { SecurityDevicesQueryRepository } from './reposotories/query-repositories/security-devices-query-repository'
import { UsersQueryRepository } from './reposotories/query-repositories/users-query-repository'
import { RateLimitsRepository } from './reposotories/rate-limits-repository'
import { SecurityDevicesRepository } from './reposotories/security-devices-repository'
import { UsersRepository } from './reposotories/users-repository'

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
