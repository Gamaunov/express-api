import { inject, injectable } from 'inversify'
import { ObjectId } from 'mongodb'

import { PostMongooseModel } from '../../domain/PostSchema'
import {
  BlogQueryModel,
  PaginatorPostModel,
  PostDBModel,
  PostQueryModel,
  PostViewModel,
} from '../../models'
import { ExtendedUserLikes } from '../../models/db/PostDBModel'
import {
  LikeStatus,
  pagesCount,
  queryPostValidator,
  skipFn,
} from '../../shared'
import { getThreeNewestLikes } from '../../shared/utils/getThreeNewestLikes'
import { PostsRepository } from '../posts-repository'

@injectable()
export class PostsQueryRepository {
  constructor(
    @inject(PostsRepository) protected postsRepository: PostsRepository,
  ) {}
  async getPosts(
    data: PostQueryModel,
    userId?: ObjectId,
  ): Promise<PaginatorPostModel | null> {
    try {
      const queryData: PostQueryModel = queryPostValidator(data)

      const sortCriteria: { [key: string]: any } = {
        [queryData.sortBy as string]: queryData.sortDirection,
      }

      const skip = skipFn(queryData.pageNumber!, queryData.pageSize!)

      const limit = queryData.pageSize

      const posts = await PostMongooseModel.find()
        .sort(sortCriteria)
        .skip(skip)
        .limit(limit!)

      const postItems = await this.postsMapping(posts, userId)

      const totalCount: number = await PostMongooseModel.countDocuments()

      return {
        pagesCount: pagesCount(totalCount, queryData.pageSize!),
        page: queryData.pageNumber!,
        pageSize: queryData.pageSize!,
        totalCount: totalCount,
        items: postItems,
      }
    } catch (e) {
      console.log(e)
      return null
    }
  }

  async getPostsByBlogId(
    blogId: string,
    queryData: BlogQueryModel,
    userId?: ObjectId,
  ): Promise<PaginatorPostModel | null> {
    try {
      const filter = { blogId: blogId }

      const sortCriteria: { [key: string]: any } = {
        [queryData.sortBy as string]: queryData.sortDirection,
      }

      const skip = skipFn(queryData.pageNumber!, queryData.pageSize!)

      const limit = queryData.pageSize

      const posts = await PostMongooseModel.find(filter)
        .sort(sortCriteria)
        .skip(skip)
        .limit(limit!)

      const postItems = await this.postsMapping(posts, userId)

      const totalCount: number = await PostMongooseModel.countDocuments(filter)

      return {
        pagesCount: Math.ceil(totalCount / queryData.pageSize!),
        page: queryData.pageNumber!,
        pageSize: queryData.pageSize!,
        totalCount: totalCount,
        items: postItems,
      }
    } catch (e) {
      console.log(e)
      return null
    }
  }

  async findPostById(
    _id: string,
    userId?: ObjectId,
  ): Promise<PostViewModel | null> {
    const foundPost = await PostMongooseModel.findOne({
      _id,
    })

    if (!foundPost) {
      return null
    }

    let status

    if (userId) {
      status = await this.postsRepository.findUserLikeStatus(_id, userId)
    }

    const likesArray: ExtendedUserLikes[] = foundPost.likesInfo.users
    const threeNewestLikesArray = getThreeNewestLikes(likesArray)

    return {
      id: foundPost._id.toString(),
      title: foundPost.title,
      shortDescription: foundPost.shortDescription,
      content: foundPost.content,
      blogId: foundPost.blogId,
      blogName: foundPost.blogName,
      createdAt: foundPost.createdAt,
      extendedLikesInfo: {
        likesCount: foundPost.likesInfo.likesCount,
        dislikesCount: foundPost.likesInfo.dislikesCount,
        myStatus: status || LikeStatus.none,
        newestLikes: threeNewestLikesArray,
      },
    }
  }

  private async postsMapping(array: PostDBModel[], userId?: ObjectId) {
    return Promise.all(
      array.map(async (post) => {
        let status

        if (userId) {
          status = await this.postsRepository.findUserLikeStatus(
            post._id.toString(),
            userId,
          )
        }

        const likesArray: ExtendedUserLikes[] = post.likesInfo.users
        const threeNewestLikesArray = getThreeNewestLikes(likesArray)

        return {
          id: post._id.toString(),
          title: post.title,
          shortDescription: post.shortDescription,
          content: post.content,
          blogId: post.blogId,
          blogName: post.blogName,
          createdAt: post.createdAt,
          extendedLikesInfo: {
            likesCount: post.likesInfo.likesCount,
            dislikesCount: post.likesInfo.dislikesCount,
            myStatus: status || LikeStatus.none,
            newestLikes: threeNewestLikesArray,
          },
        }
      }),
    )
  }
}
