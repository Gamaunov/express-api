import { injectable } from 'inversify'
import { DeleteResult, ObjectId } from 'mongodb'
import { UpdateWriteOpResult } from 'mongoose'

import { BlogMongooseModel } from '../domain/entities/blog.schema'
import { BlogOutputModel, BlogViewModel, CreateBlogModel } from '../models'

@injectable()
export class BlogsRepository {
  async createBlog(newBlog: BlogViewModel): Promise<BlogOutputModel> {
    const blog = await BlogMongooseModel.create(newBlog)

    return {
      id: blog._id.toString(),
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: blog.createdAt,
      isMembership: blog.isMembership,
    }
  }

  async updateBlog(id: string, data: CreateBlogModel): Promise<boolean> {
    const result: UpdateWriteOpResult = await BlogMongooseModel.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name: data.name,
          description: data.description,
          websiteUrl: data.websiteUrl,
        },
      },
    )

    return result.matchedCount === 1
  }

  async deleteBlog(id: string): Promise<boolean> {
    const isBlogDeleted: DeleteResult = await BlogMongooseModel.deleteOne({
      _id: new ObjectId(id),
    })

    return isBlogDeleted.deletedCount === 1
  }

  async deleteAllBlogs(): Promise<boolean> {
    await BlogMongooseModel.deleteMany({})
    return (await BlogMongooseModel.countDocuments()) === 0
  }
}
