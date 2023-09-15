import { AvailableResolutions } from '../../../shared/types/types'

export type UpdateVideoModel = {
  title: string
  author: string
  availableResolutions: AvailableResolutions[]
  canBeDownloaded?: boolean
  minAgeRestriction?: number | null
  publicationDate: string
}
