import { ObjectId } from 'mongodb'

import { postsCollection } from '../db/db'
import { PostType } from '../db/dbTypes'

export const postsRepository = {
  async getAllPosts() {
    return postsCollection.find({}).toArray()
  },

  async getPostById(id: string): Promise<PostType | null> {
    const _id = new ObjectId(id)

    const blog: PostType | null = await postsCollection.findOne({ _id })

    return blog
  },

  // async getPostByBlogId(id: string) {
  //   let blog = db.find((b) => b.blogId === id)
  //   blog ? true : false
  // },

  async createPost(
    blogId: string,
    shortDescription: string,
    content: string,
    title: string,
  ): Promise<PostType> {
    const newPost = {
      id: new ObjectId(),
      title,
      shortDescription,
      content,
      blogId,
      blogName: title,
      createdAt: new Date().toISOString(),
    }

    await postsCollection.insertOne(newPost)

    return newPost
  },

  async updatePost(
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
  ): Promise<boolean> {
    const _id = new ObjectId(id)

    let isPostUpdated = await postsCollection.updateOne(
      { _id },
      { $set: { title, shortDescription, content, blogId } },
    )

    return isPostUpdated.matchedCount === 1
  },

  async deletePost(id: string): Promise<boolean> {
    const _id = new ObjectId(id)

    const isPostDeleted = await postsCollection.deleteOne({ _id })

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
