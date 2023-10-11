import { ObjectId, WithId } from 'mongodb'

import { postsCollection } from '../../../db/db'
import { PostOutput } from '../../../db/dbTypes'
import { pagesCount, skipFn } from '../../../shared'
import { postMapper } from '../helpers/mappers/post-mapper'
import { PaginatorPostModel } from '../models/PaginatorPostModel'
import { PostQueryModel } from '../models/PostQueryModel'
import { PostViewModel } from '../models/PostViewModel'
import { UpdatePostModel } from '../models/UpdatePostModel'

export const postsRepository = {
  async getAllPosts(
    queryData: PostQueryModel,
  ): Promise<PaginatorPostModel | null> {
    try {
      const sortByProperty: string = queryData.sortBy as string
      const sortDirection: number = queryData.sortDirection as number
      const sortCriteria: { [key: string]: any } = {
        [sortByProperty]: sortDirection,
      }

      const skip = skipFn(queryData.pageNumber!, queryData.pageSize!)

      const limit = queryData.pageSize

      const posts: WithId<PostViewModel>[] = await postsCollection
        .find()
        .sort(sortCriteria)
        .skip(skip)
        .limit(limit!)
        .toArray()

      const postItems = posts.map((p) => postMapper(p))

      const totalCount = await postsCollection.countDocuments()

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

  async getPostById(id: string): Promise<PostOutput | null> {
    const post = await postsCollection.findOne({ _id: new ObjectId(id) })

    if (!post) return null

    return postMapper(post)
  },

  async createPost(newPost: PostViewModel): Promise<PostViewModel> {
    const res = await postsCollection.insertOne({ ...newPost })

    return postMapper({ ...newPost, _id: res.insertedId })
  },

  async updatePost(
    postId: string,
    postData: UpdatePostModel,
  ): Promise<PostOutput | null> {
    let post = await postsCollection.findOneAndUpdate(
      { _id: new ObjectId(postId) },
      {
        $set: {
          title: postData.title,
          shortDescription: postData.shortDescription,
          content: postData.content,
          blogId: postData.blogId,
        },
      },
    )

    if (!post) return null

    return postMapper(post)
  },

  async deletePost(id: string): Promise<boolean> {
    const isPostDeleted = await postsCollection.deleteOne({
      _id: new ObjectId(id),
    })

    return isPostDeleted.deletedCount === 1
  },

  async deleteAllPosts() {
    try {
      await postsCollection.deleteMany({})
    } catch (e) {
      console.error('Error deleting documents:', e)
    }
  },
}
