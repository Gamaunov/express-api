import { ObjectId, WithId } from 'mongodb'

import { blogsCollection, postsCollection } from '../db/db'
import {
  BlogOutputModel,
  BlogQueryModel,
  BlogViewModel,
  PaginatorBlogModel,
  PaginatorPostModel,
} from '../models'
import { blogMapper, pagesCount, postMapper, skipFn } from '../shared'

export const blogsRepository = {
  async getAllBlogs(
    queryData: BlogQueryModel,
  ): Promise<PaginatorBlogModel | null> {
    try {
      const filter = {
        name: { $regex: queryData.searchNameTerm ?? '', $options: 'i' },
      }

      const sortCriteria: { [key: string]: any } = {
        [queryData.sortBy as string]: queryData.sortDirection,
      }

      const skip = skipFn(queryData.pageNumber!, queryData.pageSize!)

      const limit = queryData.pageSize

      const blogs: WithId<BlogViewModel>[] = await blogsCollection
        .find(filter)
        .sort(sortCriteria)
        .skip(skip)
        .limit(limit!)
        .toArray()

      const blogItems = blogs.map((b) => blogMapper(b))

      const totalCount = await blogsCollection.countDocuments(filter)

      return {
        pagesCount: pagesCount(totalCount, queryData.pageSize!),
        page: queryData.pageNumber!,
        pageSize: queryData.pageSize!,
        totalCount: totalCount,
        items: blogItems,
      }
    } catch (e) {
      console.log(e)
      return null
    }
  },

  async getPostsByBlogId(
    blogId: string,
    queryData: BlogQueryModel,
  ): Promise<PaginatorPostModel | null> {
    try {
      const filter = { blogId: blogId }

      const sortByProperty: string = queryData.sortBy as string
      const sortDirection: number = queryData.sortDirection as number
      const sortCriteria: { [key: string]: any } = {
        [sortByProperty]: sortDirection,
      }

      const skip = skipFn(queryData.pageNumber!, queryData.pageSize!)

      const limit = queryData.pageSize

      const posts = await postsCollection
        .find(filter)
        .sort(sortCriteria)
        .skip(skip)
        .limit(limit!)
        .toArray()

      const postItems = posts.map((p) => postMapper(p))

      const totalCount = await postsCollection.countDocuments(filter)

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
  },

  async getBlogById(id: string): Promise<BlogOutputModel | null> {
    const blog = await blogsCollection.findOne({ _id: new ObjectId(id) })

    if (!blog) return null

    return blogMapper(blog)
  },

  async createBlog(newBlog: BlogViewModel): Promise<BlogViewModel> {
    const res = await blogsCollection.insertOne({ ...newBlog })

    return blogMapper({ ...newBlog, _id: res.insertedId })
  },

  async updateBlog(
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
  ): Promise<BlogOutputModel | null> {
    let blog = await blogsCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { name, description, websiteUrl } },
    )

    if (!blog) return null

    return blogMapper(blog)
  },

  async deleteBlog(id: string): Promise<boolean> {
    const isBlogDeleted = await blogsCollection.deleteOne({
      _id: new ObjectId(id),
    })

    return isBlogDeleted.deletedCount === 1
  },

  async deleteAllBlogs() {
    try {
      await blogsCollection.deleteMany({})
    } catch (e) {
      console.error('Error deleting documents:', e)
    }
  },
}