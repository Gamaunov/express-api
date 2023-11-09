import { injectable } from 'inversify'
import { DeleteResult, ObjectId } from 'mongodb'

import { PostMongooseModel } from '../domain/PostSchema'
import { PostDBModel, PostOutputModel, UpdatePostModel } from '../models'
import { postMapper } from '../shared'

@injectable()
export class PostsRepository {
  async createPost(newPost: PostDBModel): Promise<PostOutputModel> {
    const post = await PostMongooseModel.create(newPost)

    return postMapper(post)
  }

  async updatePost(
    postId: string,
    postData: UpdatePostModel,
  ): Promise<PostOutputModel | null> {
    const post = await PostMongooseModel.findOneAndUpdate(
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
  }

  async deletePost(id: string): Promise<boolean> {
    const isPostDeleted: DeleteResult = await PostMongooseModel.deleteOne({
      _id: new ObjectId(id),
    })

    return isPostDeleted.deletedCount === 1
  }

  async deleteAllPosts(): Promise<boolean> {
    await PostMongooseModel.deleteMany({})
    return (await PostMongooseModel.countDocuments()) === 0
  }
}
