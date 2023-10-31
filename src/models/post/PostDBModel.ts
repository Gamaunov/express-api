import { WithId } from 'mongodb'

export type PostDBModel = WithId<{
  title: string
  shortDescription: string
  content: string
  blogId: string
  blogName: string
  createdAt: string
}>
