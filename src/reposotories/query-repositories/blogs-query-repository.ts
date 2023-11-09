import { injectable } from 'inversify'
import { ObjectId, WithId } from 'mongodb'

import { BlogMongooseModel } from '../../domain/BlogSchema'
import { PostMongooseModel } from '../../domain/PostSchema'
import {
  BlogOutputModel,
  BlogQueryModel,
  BlogViewModel,
  PaginatorBlogModel,
  PaginatorPostModel,
  PostOutputModel,
} from '../../models'
import { blogMapper, pagesCount, postMapper, skipFn } from '../../shared'

@injectable()
export class BlogsQueryRepository {
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

      const blogs: WithId<BlogViewModel>[] = await BlogMongooseModel.find(
        filter,
      )
        .sort(sortCriteria)
        .skip(skip)
        .limit(limit!)

      const blogItems: BlogOutputModel[] = blogs.map((b) => blogMapper(b))

      const totalCount: number = await BlogMongooseModel.countDocuments(filter)

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
  }

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

      const posts = await PostMongooseModel.find(filter)
        .sort(sortCriteria)
        .skip(skip)
        .limit(limit!)

      const postItems: PostOutputModel[] = posts.map((p) => postMapper(p))

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

  async getBlogById(id: string): Promise<BlogOutputModel | null> {
    const blog = await BlogMongooseModel.findOne({ _id: new ObjectId(id) })

    if (!blog) return null

    return blogMapper(blog)
  }
}
