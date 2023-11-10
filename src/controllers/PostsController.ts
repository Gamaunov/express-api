import { Request, Response } from 'express'
import { inject, injectable } from 'inversify'

import { CommentsService } from '../application/comments-service'
import { PostsService } from '../application/post-service'
import {
  CommentQueryModel,
  CreateCommentModel,
  CreatePostModel,
  MappedCommentModel,
  PaginatorCommentModel,
  PaginatorPostModel,
  PostOutputModel,
  PostQueryModel,
  PostViewModel,
  URIParamsPostModel,
} from '../models'
import { CommentsQueryRepository } from '../reposotories/query-repositories/comments-query-repository'
import { PostsQueryRepository } from '../reposotories/query-repositories/posts-query-repository'
import {
  PostIdType,
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  RequestWithQuery,
} from '../shared'

@injectable()
export class PostsController {
  constructor(
    @inject(PostsService) protected postsService: PostsService,
    @inject(PostsQueryRepository)
    protected postsQueryRepository: PostsQueryRepository,
    @inject(CommentsService) protected commentsService: CommentsService,
    @inject(CommentsQueryRepository)
    protected commentsQueryRepository: CommentsQueryRepository,
  ) {}

  async getPosts(req: RequestWithQuery<PostQueryModel>, res: Response) {
    const data: PostQueryModel = req.query

    const posts: PaginatorPostModel | null =
      await this.postsQueryRepository.getAllPosts(data, req.user?._id)

    return res.status(200).json(posts)
  }

  async getPost(
    req: RequestWithParams<URIParamsPostModel>,
    res: Response,
  ): Promise<void> {
    const post: PostOutputModel | null =
      await this.postsQueryRepository.getPostById(req.params.id, req.user?._id)

    post ? res.status(200).json(post) : res.sendStatus(404)
  }

  async createPost(req: RequestWithBody<CreatePostModel>, res: Response) {
    const data: CreatePostModel = req.body

    const newPost: PostViewModel | null =
      await this.postsService.createPost(data)

    return newPost ? res.status(201).json(newPost) : res.sendStatus(404)
  }

  async getComments(
    req: RequestWithParamsAndBody<PostIdType, CommentQueryModel>,
    res: Response,
  ) {
    const data = req.query

    const commentsByPostId: PaginatorCommentModel | null =
      await this.commentsQueryRepository.getCommentsByPostId(
        req.params.postId,
        data,
        req.user?._id,
      )

    return res.status(200).json(commentsByPostId)
  }

  async createComment(
    req: RequestWithParamsAndBody<PostIdType, CreateCommentModel>,
    res: Response,
  ) {
    const data: CreateCommentModel = req.body

    if (!req.user) return res.sendStatus(401)

    const userInfo = {
      userId: req.user._id,
      userLogin: req.user.accountData.login,
    }

    const createdCommentByPostId: MappedCommentModel =
      await this.commentsService.createCommentByPostId(
        req.params.postId,
        userInfo,
        data,
      )

    return res.status(201).json(createdCommentByPostId)
  }

  async updatePost(
    req: RequestWithParamsAndBody<URIParamsPostModel, CreatePostModel>,
    res: Response,
  ): Promise<void> {
    const { blogId, content, shortDescription, title } = req.body

    const isUpdated: boolean | null = await this.postsService.updatePost(
      req.params.id,
      title,
      shortDescription,
      content,
      blogId,
    )

    isUpdated ? res.sendStatus(204) : res.sendStatus(404)
  }

  async deletePost(req: RequestWithParams<URIParamsPostModel>, res: Response) {
    const isDeleted: boolean = await this.postsService.deletePost(req.params.id)

    isDeleted ? res.sendStatus(204) : res.sendStatus(404)
  }

  async deletePosts(req: Request, res: Response) {
    const isDeleted: boolean = await this.postsService.deleteAllPosts()

    isDeleted ? res.sendStatus(204) : res.sendStatus(404)
  }
}
