import { injectable } from 'inversify'
import { DeleteResult, ObjectId } from 'mongodb'
import { HydratedDocument } from 'mongoose'

import { PostMongooseModel } from '../domain/PostSchema'
import { PostDBModel, PostOutputModel, UpdatePostModel } from '../models'
import { LikeStatus } from '../shared'

@injectable()
export class PostsRepository {
  async createPost(newPost: PostDBModel): Promise<PostOutputModel> {
    const post = await PostMongooseModel.create(newPost)

    return {
      id: post._id.toString(),
      title: newPost.title,
      shortDescription: newPost.shortDescription,
      content: newPost.content,
      blogId: newPost.blogId,
      blogName: newPost.blogName,
      createdAt: newPost.createdAt,
      extendedLikesInfo: {
        likesCount: newPost.likesInfo.likesCount,
        dislikesCount: newPost.likesInfo.dislikesCount,
        myStatus: LikeStatus.none,
        newestLikes: [],
      },
    }
  }

  async updatePost(
    postId: string,
    postData: UpdatePostModel,
  ): Promise<boolean | null> {
    const post = await PostMongooseModel.updateOne(
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

    return post.matchedCount === 1
  }

  async updateLikesCount(
    postId: string,
    likesCount: number,
    dislikesCount: number,
  ): Promise<boolean> {
    const result = await PostMongooseModel.updateOne(
      { _id: postId },
      {
        $set: {
          'likesInfo.likesCount': likesCount,
          'likesInfo.dislikesCount': dislikesCount,
        },
      },
    )

    return result.matchedCount === 1
  }

  async updateLikesStatus(
    postId: string,
    userId: ObjectId,
    likeStatus: string,
  ): Promise<boolean> {
    const result = await PostMongooseModel.updateOne(
      { _id: postId, 'likesInfo.users.userId': userId },
      {
        $set: {
          'likesInfo.users.$.likeStatus': likeStatus,
        },
      },
    )

    return result.matchedCount === 1
  }

  async findUserLikeStatus(
    postId: string,
    userId: ObjectId,
  ): Promise<string | null> {
    const foundUser = await PostMongooseModel.findOne(
      { _id: postId },
      {
        'likesInfo.users': {
          $filter: {
            input: '$likesInfo.users',
            cond: { $eq: ['$$this.userId', userId.toString()] },
          },
        },
      },
    )

    if (!foundUser || foundUser.likesInfo.users.length === 0) {
      return null
    }

    return foundUser.likesInfo.users[0].likeStatus
  }

  async findUserInLikesInfo(
    postId: string,
    userId: ObjectId,
  ): Promise<PostDBModel | null> {
    const foundUser = await PostMongooseModel.findOne(
      PostMongooseModel.findOne({
        _id: postId,
        'likesInfo.users.userId': userId,
      }),
    )

    return foundUser ? foundUser : null
  }

  async findPostById(
    _id: string,
  ): Promise<HydratedDocument<PostDBModel> | null> {
    return PostMongooseModel.findOne({ _id })
  }

  async pushUserInLikesInfo(
    postId: string,
    userId: ObjectId,
    likeStatus: string,
    addedAt: string,
    userLogin: string,
  ): Promise<boolean> {
    const result = await PostMongooseModel.updateOne(
      { _id: postId },
      {
        $push: {
          'likesInfo.users': {
            addedAt,
            userId,
            userLogin,
            likeStatus,
          },
        },
      },
    )

    return result.matchedCount === 1
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
