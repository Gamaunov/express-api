import request from 'supertest'

import {
  CreateBlogModel,
  CreateCommentModel,
  CreatePostModel,
  CreateUserModel,
} from '../../src/models'
import { usersRepository } from '../../src/reposotories/users-repository'
import { ConfirmCodeType, LoginOrEmailType } from '../../src/shared'

const getRequest = () => {
  return request('http://localhost:5000/')
}

function encodeCredentials(username: string, password: string) {
  const credentials = `${username}:${password}`
  const encodedCredentials = Buffer.from(credentials).toString('base64')
  return `Basic ${encodedCredentials}`
}

describe('users', () => {
  beforeAll(async () => {
    await getRequest().delete(`${'testing'}/all-data`)
  })

  const username = 'admin'
  const password = 'qwerty'
  const authHeader = encodeCredentials(username, password)

  let superUser: any
  let superUserToken: any
  let refreshedSuperUserToken: any
  let createdBlog: any = null
  let createdPost: any = null
  let commentId: any = null

  const dataSUser: CreateUserModel = {
    login: 'login12345',
    password: 'password123',
    email: 'gamaunov1911@gmail.com',
  }

  beforeEach(async () => {
    //should create super user with field - isConfirmed: true

    const superUserReq = await getRequest()
      .post(`users`)
      .set('Authorization', authHeader)
      .send(dataSUser)
      .expect(201)

    superUser = superUserReq.body

    //should login super user
    const loginData: LoginOrEmailType = {
      loginOrEmail: 'login12345',
      password: 'password123',
    }
    const loginSuperUser = await getRequest()
      .post(`auth/login`)
      .send(loginData)
      .expect(200)

    superUserToken = loginSuperUser.body.accessToken

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

    //creating posts
    const postData: CreatePostModel = {
      title: 'string',
      shortDescription: 'string',
      content: 'string',
      blogId: createdBlog.id,
    }

    const createRequest = await getRequest()
      .post('posts')
      .set('Authorization', authHeader)
      .send(postData)
      .expect(201)

    createdPost = createRequest.body

    expect(createdPost).toEqual({
      id: expect.any(String),
      title: postData.title,
      shortDescription: postData.shortDescription,
      content: postData.content,
      blogId: postData.blogId,
      blogName: 'string',
      createdAt: expect.any(String),
    })

    //creating new comment by superUserToken
    const commentBody: CreateCommentModel = {
      content: 'stringstringstringst',
    }

    const createCommentRequest = await getRequest()
      .post(`posts/${createdPost.id}/comments`)
      .set('Authorization', `Bearer ${superUserToken}`)
      .send(commentBody)
      .expect(201)

    commentId = createCommentRequest.body.id
  })

  it(`should return information about current user`, async () => {
    const userInfoReq = await getRequest()
      .get(`auth/me/`)
      .set('Authorization', `Bearer ${superUserToken}`)
      .expect(200)

    const userInfo = userInfoReq.body

    expect(userInfo).toEqual({
      email: superUser.email,
      login: superUser.login,
      userId: superUser.id,
    })
  })

  it(`should return accessToken in body & refreshToken in cookie`, async () => {
    const data: LoginOrEmailType = {
      loginOrEmail: dataSUser.login,
      password: dataSUser.password,
    }

    const createTokensReq = await getRequest()
      .post(`auth/login`)
      .send(data)
      .expect(200)

    const userInfo = createTokensReq.body

    expect(userInfo).toEqual({
      accessToken: expect.any(String),
    })

    const refreshTokenCookie = createTokensReq.header['set-cookie'].find(
      (cookie: string) => cookie.startsWith('refreshToken='),
    )

    expect(refreshTokenCookie).toBeDefined()
  })

  it(`should generate new pair of access and refresh tokens`, async () => {
    const generateTokensReq = await getRequest()
      .post(`auth/refresh-token`)
      .set('Cookie', `refreshToken=${superUserToken}`)
      .expect(200)

    const userInfo = generateTokensReq.body

    expect(userInfo).toEqual({
      accessToken: expect.any(String),
    })

    const refreshTokenCookie = generateTokensReq.header['set-cookie'].find(
      (cookie: string) => cookie.startsWith('refreshToken='),
    )

    refreshedSuperUserToken = refreshTokenCookie.split('refreshToken=')[1]

    expect(refreshTokenCookie).toBeDefined()

    //case already invalid token
    await getRequest()
      .post(`auth/refresh-token`)
      .set('Cookie', `refreshToken=${superUserToken}`)
      .expect(401)
  })

  it(`should revoke correct refreshToken`, async () => {
    const generateTokensReq = await getRequest()
      .post(`auth/logout`)
      .set('Cookie', `refreshToken=${refreshedSuperUserToken}`)
      .expect(204)

    // case already invalid token
    await getRequest()
      .post(`auth/refresh-token`)
      .set('Cookie', `refreshToken=${refreshedSuperUserToken}`)
      .expect(401)
  })

  it(`user should be able to update your own comment`, async () => {
    const updateCommentBody: CreateCommentModel = {
      content: 'stringstringstringst',
    }

    const updateCommentReq = await getRequest()
      .put(`comments/${commentId}/`)
      .set('Authorization', `Bearer ${superUserToken}`)
      .send(updateCommentBody)
      .expect(204)

    const getUpdatedComment = await getRequest()
      .get(`comments/${commentId}/`)
      .expect(200)

    const updateComment = getUpdatedComment.body.content

    expect(updateComment).toEqual(updateCommentBody.content)
  })

  it(`user should be able to delete your own comment`, async () => {
    const deleteCommentReq = await getRequest()
      .delete(`comments/${commentId}/`)
      .set('Authorization', `Bearer ${superUserToken}`)
      .expect(204)

    await getRequest().get(`comments/${commentId}/`).expect(404)
  })

  it(`should register user +
    should confirm registration + 
    should login user +
    should return information about current user`, async () => {
    //case register user
    const registerBody: CreateUserModel = {
      login: 'login',
      password: 'password12345',
      email: 'email@gmail.com',
    }

    const registerReq = await getRequest()
      .post(`auth/registration/`)
      .send(registerBody)
      .expect(204)

    //case confirm registration
    const userByEmail = await usersRepository.findUserByEmail(
      registerBody.email,
    )

    const confirmCode = userByEmail?.emailConfirmation.confirmationCode

    const confirmBody: ConfirmCodeType = {
      code: confirmCode!,
    }

    const confirmReq = await getRequest()
      .post(`auth/registration-confirmation`)
      .send(confirmBody)
      .expect(204)

    //case login user
    const loginData: LoginOrEmailType = {
      loginOrEmail: registerBody.email,
      password: registerBody.password,
    }

    const loginUserReq = await getRequest()
      .post(`auth/login`)
      .send(loginData)
      .expect(200)

    const userToken = loginUserReq.body.accessToken

    //case return information about current user
    const userInfoReq = await getRequest()
      .get(`auth/me/`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200)

    const userInfo = userInfoReq.body

    expect(userInfo).toEqual({
      email: userByEmail!.accountData.email,
      login: userByEmail!.accountData.login,
      userId: userByEmail!._id.toString(),
    })
  })

  afterAll((done) => {
    done()
  })
})
