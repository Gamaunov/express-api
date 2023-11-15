export function encodeCredentials(username: string, password: string) {
  const credentials = `${username}:${password}`
  const encodedCredentials = Buffer.from(credentials).toString('base64')
  return `Basic ${encodedCredentials}`
}

export const username = 'admin'
export const password = 'qwerty'
export const authHeader = encodeCredentials(username, password)

export const EmptyOutput = {
  pagesCount: 0,
  page: 1,
  pageSize: 10,
  totalCount: 0,
  items: [],
}

export const likeData = {
  likeStatus: 'Like',
}

export const dislikeData = {
  likeStatus: 'Dislike',
}

export const noneData = {
  likeStatus: 'None',
}
