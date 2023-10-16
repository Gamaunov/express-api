import request from 'supertest'

import {
  CreateBlogModel,
  CreateCommentModel,
  CreatePostModel,
  CreateUserModel,
} from '../../src/models'

const getRequest = () => {
  return request('http://localhost:5000/')
}

function encodeCredentials(username: string, password: string) {
  const credentials = `${username}:${password}`
  const encodedCredentials = Buffer.from(credentials).toString('base64')
  return `Basic ${encodedCredentials}`
}

describe('comments', () => {
  beforeAll(async () => {
    await getRequest().delete(`${'testing'}/all-data`)
  })

  let createdBlog: any = null
  let createdPost: any = null
  let createdUser: any = null
  let createdComment: any = null
  let commentId: any = null
  it(`should create user with correct input data +
    should login user to the system +
    should create blog with correct input data +
    should create post with correct input data +
  should create comment with correct input data + 
  should return comments for specified post + 
  should update existing comment by id with input model +
  should return comment by id +
  should delete comment by id
  `, async () => {
    const username = 'admin'
    const password = 'qwerty'
    const authHeader = encodeCredentials(username, password)

    //creating user
    const createUserData: CreateUserModel = {
      login: 'login123',
      password: 'password123',
      email: 'qvccgaov11@gmail.com',
    }

    const createdUserData = await getRequest()
      .post('users')
      .set('Authorization', authHeader)
      .send(createUserData)
      .expect(201)

    createdUser = createdUserData.body

    expect(createdUser).toEqual({
      id: expect.any(String),
      email: createUserData.email,
      login: createUserData.login,
      createdAt: expect.any(String),
    })

    //login user
    const loginData = {
      loginOrEmail: 'login123',
      password: 'password123',
    }

    const loggedUser = await getRequest()
      .post('auth/login')
      .send(loginData)
      .expect(200)

    const userToken = loggedUser.body.accessToken

    // creating blog
    const blogData: CreateBlogModel = {
      name: 'string',
      description: 'string',
      websiteUrl: 'https://google.com',
    }

    const createBlogRequest = await getRequest()
      .post('blogs')
      .set('Authorization', authHeader)
      .send(blogData)
      .expect(201)

    createdBlog = createBlogRequest.body

    expect(createdBlog).toEqual({
      id: expect.any(String),
      name: blogData.name,
      description: blogData.description,
      websiteUrl: blogData.websiteUrl,
      createdAt: expect.any(String),
      isMembership: false,
    })

    // //creating posts
    const data: CreatePostModel = {
      title: 'string',
      shortDescription: 'string',
      content: 'string',
      blogId: createdBlog.id,
    }

    const createRequest = await getRequest()
      .post('posts')
      .set('Authorization', authHeader)
      .send(data)
      .expect(201)

    createdPost = createRequest.body

    expect(createdPost).toEqual({
      id: expect.any(String),
      title: data.title,
      shortDescription: data.shortDescription,
      content: data.content,
      blogId: data.blogId,
      blogName: 'string',
      createdAt: expect.any(String),
    })

    //creating new comment
    const commentBody: CreateCommentModel = {
      content: 'stringstringstringst',
    }

    const updatedAuthHeader = `Bearer ${userToken}`
    const createCommentRequest = await getRequest()
      .post(`posts/${createdPost.id}/comments`)
      .set('Authorization', updatedAuthHeader)
      .send(commentBody)
      .expect(201)

    commentId = createCommentRequest.body.id

    //return comments for specified post
    const queryCommentsParams = {
      pageNumber: 1,
      pageSize: 5,
    }

    const commentsForPost = await getRequest()
      .get(`posts/${createdPost.id}/comments`)
      .query(queryCommentsParams)
      .expect(200)

    const resCommentByPostId = commentsForPost.body

    const firstComment = resCommentByPostId.items[0]

    expect(resCommentByPostId).toEqual({
      pagesCount: 1,
      page: 1,
      pageSize: queryCommentsParams.pageSize,
      totalCount: 1,
      items: [
        {
          id: firstComment.id,
          content: firstComment.content,
          commentatorInfo: {
            userId: firstComment.commentatorInfo.userId,
            userLogin: firstComment.commentatorInfo.userLogin,
          },
          createdAt: firstComment.createdAt,
        },
      ],
    })

    //update existing comment by id with input model
    const updatedCommentData = {
      content: 'updatedupdatedupdatedupdated',
    }

    const updatedComment = await getRequest()
      .put(`comments/${commentId}`)
      .set('Authorization', updatedAuthHeader)
      .send(updatedCommentData)
      .expect(204)

    //return existing comment by id with changed content
    const commentById = await getRequest()
      .get(`comments/${commentId}`)
      .expect(200)

    const updatedCommentResult = commentById.body

    expect(updatedCommentResult).toEqual({
      id: updatedCommentResult.id,
      content: updatedCommentData.content, //changed field from test above
      commentatorInfo: {
        userId: updatedCommentResult.commentatorInfo.userId,
        userLogin: updatedCommentResult.commentatorInfo.userLogin,
      },
      createdAt: updatedCommentResult.createdAt,
    })

    //delete comment by id
    const deletedComment = await getRequest()
      .delete(`comments/${commentId}`)
      .set('Authorization', updatedAuthHeader)
      .expect(204)
  })
  afterAll((done) => {
    done()
  })
})
