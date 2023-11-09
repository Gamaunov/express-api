import { LikeStatus } from '../../enums/comments/likeStatus'

export type LikeStatusType = {
  likeStatus: LikeStatus.like | LikeStatus.dislike | LikeStatus.none
}
