import { Request, Response } from 'express'
import { inject, injectable } from 'inversify'

import { BlogsService } from '../application/blogs.service'
import { CommentsService } from '../application/comments.service'
import { PostsService } from '../application/post.service'
import { RateLimitsService } from '../application/rateLimit.service'
import { SecurityDevicesService } from '../application/securityDevices.service'
import { UsersService } from '../application/users.service'

@injectable()
export class TestingController {
  constructor(
    @inject(BlogsService) protected blogsService: BlogsService,
    @inject(PostsService) protected postsService: PostsService,
    @inject(UsersService) protected usersService: UsersService,
    @inject(CommentsService)
    protected commentsService: CommentsService,
    @inject(RateLimitsService)
    protected rateLimitsService: RateLimitsService,
    @inject(SecurityDevicesService)
    protected securityDevicesService: SecurityDevicesService,
  ) {}

  async clearDatabase(req: Request, res: Response) {
    await this.blogsService.deleteAllBlogs()
    await this.postsService.deleteAllPosts()
    await this.usersService.deleteAllUsers()
    await this.commentsService.deleteAllComments()
    await this.rateLimitsService.deleteAllRateLimits()
    await this.securityDevicesService.deleteAllDevices()

    res.sendStatus(204)
  }
}
