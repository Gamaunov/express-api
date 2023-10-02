import { ObjectId } from 'mongodb'

import { postsCollection } from '../db/db'
import { PostViewModel } from '../models/index'

export const postsRepository = {
  async getAllPosts() {
    return postsCollection.find({}, { projection: { _id: 0 } }).toArray()
  },

  async getPostById(id: string): Promise<PostViewModel | null> {
    const post: PostViewModel | null = await postsCollection.findOne(
      { id },
      { projection: { _id: 0 } },
    )

    return post
  },

  async createPost(
    blogId: string,
    shortDescription: string,
    content: string,
    title: string,
  ): Promise<PostViewModel> {
    const newPost = {
      id: new ObjectId().toString(),
      title,
      shortDescription,
      content,
      blogId,
      blogName: title,
      createdAt: new Date().toISOString(),
    }

    await postsCollection.insertOne(newPost)

    const transformedResponse = {
      id: newPost.id,
      title: newPost.title,
      shortDescription: newPost.shortDescription,
      content: newPost.content,
      blogId: newPost.blogId,
      blogName: newPost.blogName,
      createdAt: newPost.createdAt,
    }

    return transformedResponse
  },

  async updatePost(
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
  ): Promise<boolean> {
    let isPostUpdated = await postsCollection.updateOne(
      { id },
      { $set: { title, shortDescription, content, blogId } },
    )

    return isPostUpdated.matchedCount === 1
  },

  async deletePost(id: string): Promise<boolean> {
    const isPostDeleted = await postsCollection.deleteOne({ id })

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
