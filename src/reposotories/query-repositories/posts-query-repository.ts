import { ObjectId, WithId } from 'mongodb'

import {
  PaginatorPostModel,
  PostOutputModel,
  PostQueryModel,
  PostViewModel,
} from '../../models'
import { Posts } from '../../schemas/postSchema'
import { pagesCount, postMapper, skipFn } from '../../shared'

export const postsQueryRepository = {
  async getAllPosts(
    queryData: PostQueryModel,
  ): Promise<PaginatorPostModel | null> {
    try {
      const sortCriteria: { [key: string]: any } = {
        [queryData.sortBy as string]: queryData.sortDirection,
      }

      const skip = skipFn(queryData.pageNumber!, queryData.pageSize!)

      const limit = queryData.pageSize

      const posts: WithId<PostViewModel>[] = await Posts.find()
        .sort(sortCriteria)
        .skip(skip)
        .limit(limit!)

      const postItems: PostOutputModel[] = posts.map(
        (p: WithId<PostViewModel>) => postMapper(p),
      )

      const totalCount: number = await Posts.countDocuments()

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
  },

  async getPostById(id: string): Promise<PostOutputModel | null> {
    const post = await Posts.findOne({ _id: new ObjectId(id) })

    if (!post) return null

    return postMapper(post)
  },
}
