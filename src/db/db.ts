import { AvailableResolutions, DBType } from '../shared/types/types'

export const db: DBType = {
  video: [
    {
      id: 0,
      title: 'string',
      author: 'string',
      canBeDownloaded: true,
      minAgeRestriction: null,
      createdAt: '2023-09-14T05:31:42.791Z',
      publicationDate: '2023-09-14T05:31:42.791Z',
      availableResolutions: [AvailableResolutions.P144],
    },
  ],
}
