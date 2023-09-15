import { AvailableResolutions } from '../../../shared/types/types'

export type CreateVideoModel = {
  title: string
  author: string
  availableResolutions: AvailableResolutions[]
}
