import { LikeStatus } from '../enums/comments/likeStatus'

type LikeSwitcherType = {
  likesCount: number
  dislikesCount: number
}
export function likeSwitcher(
  LikeDBStatus: string | null,
  likeStatus: string,
  likesCount: number,
  dislikesCount: number,
): LikeSwitcherType {
  switch (LikeDBStatus) {
    case LikeStatus.none:
      if (likeStatus === LikeStatus.like) {
        likesCount++
      }

      if (likeStatus === LikeStatus.dislike) {
        dislikesCount++
      }

      break

    case LikeStatus.like:
      if (likeStatus === LikeStatus.none) {
        likesCount--
      }

      if (likeStatus === LikeStatus.dislike) {
        likesCount--
        dislikesCount++
      }

      break

    case LikeStatus.dislike:
      if (likeStatus === LikeStatus.none) {
        dislikesCount--
      }

      if (likeStatus === LikeStatus.like) {
        dislikesCount--
        likesCount++
      }

      break
  }

  return { likesCount, dislikesCount }
}
