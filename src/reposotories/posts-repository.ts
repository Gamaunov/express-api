import { DeleteResult, ObjectId } from 'mongodb'

import { PostDBModel, PostOutputModel, UpdatePostModel } from '../models'
import { Posts } from '../schemas/postSchema'
import { postMapper } from '../shared'

export const postsRepository = {
  async createPost(newPost: PostDBModel): Promise<PostOutputModel> {
    const post = await Posts.create(newPost)

    return postMapper(post)
  },

  async updatePost(
    postId: string,
    postData: UpdatePostModel,
  ): Promise<PostOutputModel | null> {
    const post = await Posts.findOneAndUpdate(
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
    const isPostDeleted: DeleteResult = await Posts.deleteOne({
      _id: new ObjectId(id),
    })

    return isPostDeleted.deletedCount === 1
  },

  async deleteAllPosts(): Promise<void> {
    try {
      await Posts.deleteMany({})
    } catch (e) {
      console.error('Error deleting documents:', e)
    }
  },
}
