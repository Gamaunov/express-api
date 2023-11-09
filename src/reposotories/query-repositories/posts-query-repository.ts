import { inject, injectable } from 'inversify'
import { ObjectId, WithId } from 'mongodb'

import { PostMongooseModel } from '../../domain/PostSchema'
import {
  PaginatorPostModel,
  PostOutputModel,
  PostQueryModel,
  PostViewModel,
} from '../../models'
import { pagesCount, postMapper, skipFn } from '../../shared'
import { PostsRepository } from '../posts-repository'

@injectable()
export class PostsQueryRepository {
  constructor(
    @inject(PostsRepository) protected postsRepository: PostsRepository,
  ) {}
  async getAllPosts(
    queryData: PostQueryModel,
  ): Promise<PaginatorPostModel | null> {
    try {
      const sortCriteria: { [key: string]: any } = {
        [queryData.sortBy as string]: queryData.sortDirection,
      }

      const skip = skipFn(queryData.pageNumber!, queryData.pageSize!)

      const limit = queryData.pageSize

      const posts: WithId<PostViewModel>[] = await PostMongooseModel.find()
        .sort(sortCriteria)
        .skip(skip)
        .limit(limit!)

      const postItems: PostOutputModel[] = posts.map(
        (p: WithId<PostViewModel>) => postMapper(p),
      )

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

  async getPostById(id: string): Promise<PostOutputModel | null> {
    const post = await PostMongooseModel.findOne({ _id: new ObjectId(id) })

    if (!post) return null

    return postMapper(post)
  }
}
