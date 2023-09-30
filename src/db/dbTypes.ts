import { ObjectId } from 'mongodb'

export type BlogType = {
  _id: ObjectId
  name: string
  description: string
  websiteUrl: string
  createdAt: string
  isMembership: boolean
}

export type PostType = {
  _id: ObjectId
  title: string
  shortDescription: string
  content: string
  blogId: string
  blogName?: string
  createdAt: string
}

export type DBType = {
  blogs: BlogType[]
  posts: PostType[]
}
