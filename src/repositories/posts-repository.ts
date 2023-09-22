import { db } from '../db/db'

export const postsRepository = {
  getAllPosts() {
    return db.posts
  },

  getPostById(id: string) {
    let post = db.posts.find((p) => p.id === id)
    return post
  },

  getPostByBlogId(id: string) {
    let blog = db.posts.find((b) => b.blogId === id)
    blog ? true : false
  },

  createPost(
    blogId: string,
    content: string,
    shortDescription: string,
    title: string,
  ) {
    const newpost = {
      id: new Date().toISOString(),
      blogId: blogId,
      content: content,
      shortDescription: shortDescription,
      title: title,
      blogName: title,
    }
    db.posts.push(newpost)
    return newpost
  },

  updatePost(
    id: string,
    blogId: string,
    content: string,
    shortDescription: string,
    title: string,
  ) {
    let post = db.posts.find((p) => p.id === id)

    if (!post) {
      return false
    } else {
      post.blogId = blogId
      post.content = content
      post.shortDescription = shortDescription
      post.title = title
      return true
    }
  },

  deletePost(id: string) {
    const index = db.posts.findIndex((post) => post.id === id)
    if (index !== -1) {
      db.posts.splice(index, 1)
      return true
    }
    return false
  },

  deleteAllPosts() {
    db.posts.length = 0
  },
}
