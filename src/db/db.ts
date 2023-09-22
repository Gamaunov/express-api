import { DBType } from '../shared/types/types'

export const db: DBType = {
  blogs: [
    {
      id: '0',
      name: 'string',
      description: 'string',
      websiteUrl: 'string',
    },
  ],
  posts: [
    {
      id: '0',
      title: 'string',
      shortDescription: 'string',
      content: 'string',
      blogId: 'string',
      blogName: 'string',
    },
  ],
}
