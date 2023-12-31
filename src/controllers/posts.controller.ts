import { Request, Response } from 'express'
import { inject, injectable } from 'inversify'

import { CommentsService } from '../application/comments.service'
import { PostsService } from '../application/post.service'
import { CommentsQueryRepository } from '../infrastructure/query/comments.query.repository'
import { PostsQueryRepository } from '../infrastructure/query/posts.query.repository'
import {
  CommentQueryModel,
  CommentViewModel,
  CreateCommentModel,
  CreatePostModel,
  PaginatorCommentModel,
  PaginatorPostModel,
  PostOutputModel,
  PostQueryModel,
  PostViewModel,
  URIParamsPostIdModel,
  URIParamsPostModel,
} from '../models'
import {
  LikeStatusType,
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
      await this.postsQueryRepository.getPosts(data, req.user?._id)

    return res.status(200).json(posts)
  }

  async getPost(
    req: RequestWithParams<URIParamsPostModel>,
    res: Response,
  ): Promise<void> {
    const post: PostOutputModel | null =
      await this.postsQueryRepository.findPostById(req.params.id, req.user?._id)

    post ? res.status(200).json(post) : res.sendStatus(404)
  }

  async createPost(req: RequestWithBody<CreatePostModel>, res: Response) {
    const data: CreatePostModel = req.body

    const newPost: PostViewModel | null =
      await this.postsService.createPost(data)

    return newPost ? res.status(201).json(newPost) : res.sendStatus(404)
  }

  async getComments(
    req: RequestWithParamsAndBody<URIParamsPostIdModel, CommentQueryModel>,
    res: Response,
  ) {
    const data: CommentQueryModel = req.query

    const commentsByPostId: PaginatorCommentModel | null =
      await this.commentsQueryRepository.getCommentsByPostId(
        req.params.postId,
        data,
        req.user?._id,
      )

    return res.status(200).json(commentsByPostId)
  }

  async createComment(
    req: RequestWithParamsAndBody<URIParamsPostIdModel, CreateCommentModel>,
    res: Response,
  ) {
    const data: CreateCommentModel = req.body

    if (!req.user) return res.sendStatus(401)

    const userInfo = {
      userId: req.user._id,
      userLogin: req.user.accountData.login,
    }

    const createdCommentByPostId: CommentViewModel =
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

  async updateLikeStatus(
    req: RequestWithParamsAndBody<URIParamsPostIdModel, LikeStatusType>,
    res: Response,
  ): Promise<void> {
    const isUpdated: boolean = await this.postsService.updateLikeStatus(
      req.params.postId,
      req.body.likeStatus,
      req.user!._id,
    )

    if (isUpdated) {
      const updatedPost: PostViewModel | null =
        await this.postsQueryRepository.findPostById(req.params.postId)

      res.status(204).json(updatedPost)
    }
  }

  async deletePost(
    req: RequestWithParams<URIParamsPostModel>,
    res: Response,
  ): Promise<void> {
    const isDeleted: boolean = await this.postsService.deletePost(req.params.id)

    isDeleted ? res.sendStatus(204) : res.sendStatus(404)
  }

  async deletePosts(req: Request, res: Response): Promise<void> {
    const isDeleted: boolean = await this.postsService.deleteAllPosts()

    isDeleted ? res.sendStatus(204) : res.sendStatus(404)
  }
}
