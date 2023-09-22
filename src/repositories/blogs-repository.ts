import { db } from '../db/db'

export const blogsRepository = {
  getAllBlogs() {
    return db.blogs
  },

  getBlogById(id: string) {
    let blog = db.blogs.find((b) => b.id === id)
    return blog
  },

  getBlogByBlogId(id: string) {
    const blog = db.blogs.find((b) => b.id === id)
    return blog || null
  },

  createBlog(name: string, description: string, websiteUrl: string) {
    const newBlog = {
      id: new Date().toISOString(),
      name: name,
      description: description,
      websiteUrl: websiteUrl,
    }
    db.blogs.push(newBlog)
    return newBlog
  },

  updateBlog(
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
  ) {
    let blog = db.blogs.find((b) => b.id === id)

    if (!blog) {
      return false
    } else {
      blog.name = name
      blog.description = description
      blog.websiteUrl = websiteUrl
      return true
    }
  },

  deleteBlog(id: string) {
    const index = db.blogs.findIndex((b) => b.id === id)
    if (index !== -1) {
      db.blogs.splice(index, 1)
      return true
    }
    return false
  },

  deleteAllBlogs() {
    db.blogs.length = 0
  },
}
