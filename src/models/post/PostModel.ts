import { WithId } from 'mongodb'

export type PostModel = WithId<{
  title: string
  shortDescription: string
  content: string
  blogId: string
  blogName: string
  createdAt: string
}>
