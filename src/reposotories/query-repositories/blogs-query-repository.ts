import { injectable } from 'inversify'
import { ObjectId, WithId } from 'mongodb'

import { BlogMongooseModel } from '../../domain/BlogSchema'
import {
  BlogDBModel,
  BlogOutputModel,
  BlogQueryModel,
  BlogViewModel,
  PaginatorBlogModel,
} from '../../models'
import {
  pagesCount,
  queryBlogValidator,
  skipFn,
} from '../../shared'

@injectable()
export class BlogsQueryRepository {
  async getAllBlogs(data: BlogQueryModel): Promise<PaginatorBlogModel | null> {
    try {
      const queryData: BlogQueryModel = queryBlogValidator(data)
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
        .lean()

      const blogItems: BlogOutputModel[] = await this.blogsMapping(blogs)

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

  async getBlogById(id: string): Promise<BlogOutputModel | null> {
    const blog = await BlogMongooseModel.findOne({ _id: new ObjectId(id) })

    if (!blog) return null

    return {
      id: blog._id.toString(),
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: blog.createdAt,
      isMembership: blog.isMembership,
    }
  }

  private async blogsMapping(array: BlogDBModel[]): Promise<BlogOutputModel[]> {
    return array.map((blog) => {
      return {
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership,
      }
    })
  }
}
