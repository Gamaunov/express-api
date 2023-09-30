import { ObjectId } from 'mongodb'

export type BlogType = {
  id: ObjectId
  name: string
  description: string
  websiteUrl: string
  createdAt: string
  isMembership: boolean
}

export type PostType = {
  id: ObjectId
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
