import { Request } from 'express'

export type RequestWithBody<T> = Request<{}, {}, T>
export type RequestWithQuery<T> = Request<{}, {}, {}, T>
export type RequestWithParams<T> = Request<T>
export type RequestWithParamsAndBody<T, B> = Request<T, {}, B>

export type BlogsType = {
  id: string
  name: string
  description: string
  websiteUrl: string
}

export type PostsType = {
  id: string
  title: string
  shortDescription: string
  content: string
  blogId: string
  blogName?: string
}

export type DBType = {
  blogs: BlogsType[]
  posts: PostsType[]
}
