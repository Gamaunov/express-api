import { ObjectId, WithId } from 'mongodb'

import { blogsCollection, postsCollection } from '../../../db/db'
import { BlogOutput } from '../../../db/dbTypes'
import { pagesCount, skipFn } from '../../../shared'
import { PaginatorPostModel, postMapper } from '../../posts'
import { blogMapper } from '../helpers/mappers/blog-mappers'
import { BlogQueryModel } from '../models/BlogQueryModel'
import { BlogViewModel } from '../models/BlogViewModel'
import { PaginatorBlogModel } from '../models/PaginatorBlogModel'
import { log } from 'console'


export const blogsRepository = {
  async getAllBlogs(
    queryData: BlogQueryModel,
  ): Promise<PaginatorBlogModel | null> {
    try {
      const filter =  { name: { $regex: queryData.searchNameTerm ?? '', $options: 'i' } }

      const sortByProperty: string = queryData.sortBy as string
      const sortDirection: number = queryData.sortDirection as number
      const sortCriteria: { [key: string]: any } = {
        [sortByProperty]: sortDirection,
      }
      

      const skip = skipFn(queryData.pageNumber!, queryData.pageSize!)

      const limit = queryData.pageSize 

      console.log(skip, limit);
      

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

  async getBlogById(id: string): Promise<BlogOutput | null> {
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
  ): Promise<BlogOutput | null> {
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