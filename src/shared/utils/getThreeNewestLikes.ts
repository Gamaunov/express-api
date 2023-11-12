import { ExtendedUserLikes } from '../../models/db/PostDBModel'
import { LikeStatus } from '../enums/comments/likeStatus'

type ThreeNewestLikesType = {
  addedAt: string
  userId: string
  login: string
}

export function getThreeNewestLikes(
  likesArray: ExtendedUserLikes[],
): ThreeNewestLikesType[] {
  return likesArray
    .filter((p) => p.likeStatus === LikeStatus.like)
    .sort((a, b) => -a.addedAt.localeCompare(b.addedAt))
    .map((p) => {
      return {
        addedAt: p.addedAt,
        userId: p.userId,
        login: p.userLogin,
      }
    })
    .splice(0, 3)
}
