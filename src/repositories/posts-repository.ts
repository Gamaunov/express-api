import { ObjectId } from 'mongodb'

import { postsCollection } from '../db/db'
import { PostOutput } from '../db/dbTypes'
import { PostViewModel, UpdatePostModel } from '../models'
import { postMapper } from '../shared'

export const postsRepository = {
  async getAllPosts(): Promise<PostOutput[]> {
    const post = await postsCollection.find({}).toArray()

    return post.map((p) => postMapper(p))
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
