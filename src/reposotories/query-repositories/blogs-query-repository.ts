import { ObjectId, WithId } from 'mongodb'

import {
  BlogOutputModel,
  BlogQueryModel,
  BlogViewModel,
  PaginatorBlogModel,
  PaginatorPostModel,
  PostOutputModel,
} from '../../models'
import { Blogs } from '../../schemas/blogSchema'
import { Posts } from '../../schemas/postSchema'
import { blogMapper, pagesCount, postMapper, skipFn } from '../../shared'

export const blogsQueryRepository = {
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

      const blogs: WithId<BlogViewModel>[] = await Blogs.find(filter)
        .sort(sortCriteria)
        .skip(skip)
        .limit(limit!)

      const blogItems: BlogOutputModel[] = blogs.map((b) => blogMapper(b))

      const totalCount: number = await Blogs.countDocuments(filter)

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

      const sortCriteria: { [key: string]: any } = {
        [queryData.sortBy as string]: queryData.sortDirection,
      }

      const skip = skipFn(queryData.pageNumber!, queryData.pageSize!)

      const limit = queryData.pageSize

      const posts = await Posts.find(filter)
        .sort(sortCriteria)
        .skip(skip)
        .limit(limit!)

      const postItems: PostOutputModel[] = posts.map((p) => postMapper(p))

      const totalCount: number = await Posts.countDocuments(filter)

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
    const blog = await Blogs.findOne({ _id: new ObjectId(id) })

    if (!blog) return null

    return blogMapper(blog)
  },
}
