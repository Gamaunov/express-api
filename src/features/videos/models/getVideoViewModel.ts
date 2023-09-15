import { VideoType } from '../../../shared/types/types'
import { VideoViewModel } from './VideoViewModel'

export const getVideoViewModel = (dbVideo: VideoType): VideoViewModel => {
  return {
    id: dbVideo.id,
    title: dbVideo.title,
    author: dbVideo.author,
    canBeDownloaded: dbVideo.canBeDownloaded,
    minAgeRestriction: dbVideo.minAgeRestriction,
    createdAt: dbVideo.createdAt,
    publicationDate: dbVideo.publicationDate,
    availableResolutions: dbVideo.availableResolutions,
  }
}
