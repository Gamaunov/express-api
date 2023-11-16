import dotenv from 'dotenv'
import { ObjectId } from 'mongodb'
import mongoose from 'mongoose'
import request from 'supertest'

import { app } from '../../src/app'
import {
  CreateBlogModel,
  CreateCommentModel,
  CreatePostModel,
  CreateUserModel,
} from '../../src/models'
import { authHeader } from '../helpers.test'

dotenv.config()

const mongoURI: string = process.env.MONGO_URI || `mongodb://0.0.0.0:27017/test`

if (!mongoURI) throw new Error('mongoURI not found')

describe('comments router', () => {
  beforeAll(async () => {
    await mongoose.connect(mongoURI)
    await request(app).delete('/testing/all-data')
  })

  afterAll(async () => {
    await mongoose.connection.close()
  })

  describe('comments', () => {
    beforeAll(async () => {
      await request(app).delete(`${'/testing'}/all-data`)
    })

    let createdBlog: any = null
    let createdPost: any = null
    let createdUser: any = null
    let BearerUserToken: any = null
    let InvalidBearerUserToken = BearerUserToken + 'q'
    let commentId: any = null
    let userToken: any = null

    it('should creat user', async () => {
      const createUserData: CreateUserModel = {
        login: 'login123',
        password: 'password123',
        email: 'qvccgaov11@gmail.com',
      }

      const createdUserData = await request(app)
        .post('/users')
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
    })

    it(`should login user`, async () => {
      const loginData = {
        loginOrEmail: 'login123',
        password: 'password123',
      }

      const loggedUser = await request(app)
        .post('/auth/login')
        .send(loginData)
        .expect(200)

      userToken = loggedUser.body.accessToken
    })

    it(`should create blog`, async () => {
      const blogData: CreateBlogModel = {
        name: 'string',
        description: 'string',
        websiteUrl: 'https://google.com',
      }

      const createBlogRequest = await request(app)
        .post('/blogs')
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
    })

    it(`should create post`, async () => {
      const data: CreatePostModel = {
        title: 'string',
        shortDescription: 'string',
        content: 'string',
        blogId: createdBlog.id,
      }

      const createRequest = await request(app)
        .post('/posts')
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
        extendedLikesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: 'None',
          newestLikes: [],
        },
      })
    })

    it(`should create comment`, async () => {
      const commentBody: CreateCommentModel = {
        content: 'stringstringstringst',
      }

      BearerUserToken = `Bearer ${userToken}`
      const createCommentRequest = await request(app)
        .post(`/posts/${createdPost.id}/comments`)
        .set('Authorization', BearerUserToken)
        .send(commentBody)
        .expect(201)

      commentId = createCommentRequest.body.id
    })

    it(`shouldn't create comment with incorrect content length`, async () => {
      //creating new comment
      const commentBody: CreateCommentModel = {
        content: 'string',
      }

      BearerUserToken = `Bearer ${userToken}`
      const createCommentRequest = await request(app)
        .post(`/posts/${createdPost.id}/comments`)
        .set('Authorization', BearerUserToken)
        .send(commentBody)
        .expect(400)
    })

    it(`shouldn't create comment with incorrect Authorization`, async () => {
      //creating new comment
      const commentBody: CreateCommentModel = {
        content: 'string',
      }

      BearerUserToken = `Bearer ${userToken}`
      const createCommentRequest = await request(app)
        .post(`/posts/${createdPost.id}/comments`)
        .set('Authorization', BearerUserToken + '1')
        .send(commentBody)
        .expect(401)
    })

    it('should return comments for specified post', async () => {
      //return comments for specified post
      const queryCommentsParams = {
        pageNumber: 1,
        pageSize: 5,
      }

      const commentsForPost = await request(app)
        .get(`/posts/${createdPost.id}/comments`)
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
            likesInfo: {
              likesCount: 0,
              dislikesCount: 0,
              myStatus: 'None',
            },
          },
        ],
      })
    })

    it(
      'should update existing comment by id with input model' +
        ' + should return comment by id',
      async () => {
        //update existing comment by id with input model
        const updatedCommentData = {
          content: 'updatedupdatedupdatedupdated',
        }

        const updatedComment = await request(app)
          .put(`/comments/${commentId}`)
          .set('Authorization', BearerUserToken)
          .send(updatedCommentData)
          .expect(204)

        //return existing comment by id with changed content
        const commentById = await request(app)
          .get(`/comments/${commentId}`)
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
          likesInfo: {
            likesCount: 0,
            dislikesCount: 0,
            myStatus: 'None',
          },
        })
      },
    )

    it(`should return 404 by deleting not existing comment `, async () => {
      await request(app)
        .delete(`/comments/232423543243`)
        .set('Authorization', BearerUserToken)
        .expect(404)
    })

    //like-status
    it(`shouldn't update like status if the inputModel has incorrect values`, async () => {
      const data = {
        likeStatus: 'Nonsense',
      }

      const updatedComment = await request(app)
        .put(`/comments/${commentId}/like-status`)
        .set('Authorization', BearerUserToken)
        .send(data)
        .expect(400)

      const responseBody = updatedComment.body

      expect(responseBody).toEqual({
        errorsMessages: [{ message: expect.any(String), field: 'likeStatus' }],
      })
    })

    it(`shouldn't update like status if user unauthorized or has incorrect data`, async () => {
      const data = {
        likeStatus: 'None',
      }

      await request(app)
        .put(`/comments/${commentId}/like-status`)
        .set('Authorization', InvalidBearerUserToken)
        .send(data)
        .expect(401)

      await request(app)
        .put(`/comments/${commentId}/like-status`)
        .send(data)
        .expect(401)
    })

    it(`shouldn't update like status if comment with specified id doesn't exists`, async () => {
      const data = {
        likeStatus: 'None',
      }

      await request(app)
        .put(`/comments/${new ObjectId()}/like-status`)
        .set('Authorization', BearerUserToken)
        .send(data)
        .expect(404)
    })

    it(`should update like status`, async () => {
      const data = {
        likeStatus: 'Like',
      }

      await request(app)
        .put(`/comments/${commentId}/like-status`)
        .set('Authorization', BearerUserToken)
        .send(data)
        .expect(204)

      const updatedComment = await request(app)
        .get(`/comments/${commentId}`)
        .expect(200)

      const responseBody = updatedComment.body

      expect(responseBody).toEqual({
        id: responseBody.id,
        content: responseBody.content,
        commentatorInfo: {
          userId: responseBody.commentatorInfo.userId,
          userLogin: responseBody.commentatorInfo.userLogin,
        },
        createdAt: responseBody.createdAt,
        likesInfo: {
          likesCount: 1,
          dislikesCount: 0,
          myStatus: 'None',
        },
      })
    })

    it(`should update like status`, async () => {
      const data = {
        likeStatus: 'Dislike',
      }

      await request(app)
        .put(`/comments/${commentId}/like-status`)
        .set('Authorization', BearerUserToken)
        .send(data)
        .expect(204)

      const updatedComment = await request(app)
        .get(`/comments/${commentId}`)
        .expect(200)

      const responseBody = updatedComment.body

      expect(responseBody).toEqual({
        id: responseBody.id,
        content: responseBody.content,
        commentatorInfo: {
          userId: responseBody.commentatorInfo.userId,
          userLogin: responseBody.commentatorInfo.userLogin,
        },
        createdAt: responseBody.createdAt,
        likesInfo: {
          likesCount: 0, // -1
          dislikesCount: 1, // +1
          myStatus: 'None',
        },
      })
    })

    it(`should update like status`, async () => {
      const data = {
        likeStatus: 'None',
      }

      await request(app)
        .put(`/comments/${commentId}/like-status`)
        .set('Authorization', BearerUserToken)
        .send(data)
        .expect(204)

      const updatedComment = await request(app)
        .get(`/comments/${commentId}`)
        .expect(200)

      const responseBody = updatedComment.body

      expect(responseBody).toEqual({
        id: responseBody.id,
        content: responseBody.content,
        commentatorInfo: {
          userId: responseBody.commentatorInfo.userId,
          userLogin: responseBody.commentatorInfo.userLogin,
        },
        createdAt: responseBody.createdAt,
        likesInfo: {
          likesCount: 0,
          dislikesCount: 0, //-1
          myStatus: 'None',
        },
      })
    })
    //like-status ends
  })
})
