export type MappedCommentModel = {
  id: string
  content: string
  commentatorInfo: {
    userId: string
    userLogin: string
  }
  createdAt: string
}
