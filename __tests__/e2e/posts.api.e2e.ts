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
import { EmptyOutput, authHeader } from '../helpers.test'

dotenv.config()

const mongoURI: string = process.env.MONGO_URI || `mongodb://0.0.0.0:27017/test`

if (!mongoURI) throw new Error('mongoURI not found')

describe('posts router', () => {
  beforeAll(async () => {
    await mongoose.connect(mongoURI)
    await request(app).delete('/testing/all-data')
  })

  afterAll(async () => {
    await mongoose.connection.close()
  })

  describe('posts', () => {
    beforeAll(async () => {
      await request(app).delete(`${'/testing'}/all-data`)
    })

    let createdBlog: any = null
    let createdPost: any = null
    let createdUser: any = null
    let BearerUserToken: any = null
    let InvalidBearerUserToken = BearerUserToken + 'q'
    let commentId: any = null
    let postId: any = null
    let userToken: any = null

    it('should return 200 and empty array', async () => {
      await request(app).get('/posts').expect(200, EmptyOutput)
    })

    it(`should return 404 for not existing post`, async () => {
      await request(app).get(`${'/posts'}/5`).expect(404)
    })

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

      postId = createdPost.id

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

    it(`shouldn't update like status if the inputModel has incorrect values`, async () => {
      const data = {
        likeStatus: 'Nonsense',
      }

      const updatedComment = await request(app)
        .put(`/posts/${postId}/like-status`)
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
        .put(`/posts/${postId}/like-status`)
        .set('Authorization', InvalidBearerUserToken)
        .send(data)
        .expect(401)

      await request(app)
        .put(`/posts/${postId}/like-status`)
        .send(data)
        .expect(401)
    })

    it(`shouldn't update like status if comment with specified id doesn't exists`, async () => {
      const data = {
        likeStatus: 'None',
      }

      await request(app)
        .put(`/posts/${new ObjectId()}/like-status`)
        .set('Authorization', BearerUserToken)
        .send(data)
        .expect(404)
    })

    it(`shouldn't create post with incorrect input data`, async () => {
      //case empty title
      const data: CreatePostModel = {
        title: '',
        shortDescription: 'string',
        content: 'string',
        blogId: 'string',
      }

      await request(app)
        .post('/posts')
        .set('Authorization', authHeader)
        .send(data)
        .expect(400)

      await request(app).get('/posts').expect(200)

      //case invalid title max length > 30
      const invalidTitleData: CreatePostModel = {
        title:
          'invalidTitleDtainvalidTitleDtainvalidTitleDtainvalidTitleDtainvalidTitleDtainvalidTitleDtainvalidTitleDta',
        shortDescription: 'string',
        content: 'string',
        blogId: 'string',
      }

      await request(app)
        .post('/posts')
        .set('Authorization', authHeader)
        .send(invalidTitleData)
        .expect(400)

      await request(app).get('/posts').expect(200)

      //case empty shortDescription
      const emptyShortDescription: CreatePostModel = {
        title: 'title',
        shortDescription: '',
        content: 'string',
        blogId: 'string',
      }

      await request(app)
        .post('/posts')
        .set('Authorization', authHeader)
        .send(emptyShortDescription)
        .expect(400)

      await request(app).get('/posts').expect(200)

      //case invalid shortDescription max length > 100
      const invalidShortDescription: CreatePostModel = {
        title: 'title',
        shortDescription:
          'case invalid shortDescription max lengthcase invalid shortDescription max lengthcase invalid shortDescription max lengthcase invalid shortDescription max lengthcase invalid shortDescription max lengthcase invalid shortDescription max lengthcase invalid shortDescription max lengthcase invalid shortDescription max lengthcase invalid shortDescription max lengthcase invalid shortDescription max length',
        content: 'string',
        blogId: 'string',
      }

      await request(app)
        .post('/posts')
        .set('Authorization', authHeader)
        .send(invalidShortDescription)
        .expect(400)

      await request(app).get('/posts').expect(200)

      //case empty content
      const emptyContent: CreatePostModel = {
        title: 'title',
        shortDescription: 'shortDescription',
        content: '',
        blogId: 'string',
      }

      await request(app)
        .post('/posts')
        .set('Authorization', authHeader)
        .send(emptyContent)
        .expect(400)

      await request(app).get('/posts').expect(200)

      //case invalid content max length > 1000
      const invalidContent: CreatePostModel = {
        title: 'title',
        shortDescription: 'shortDescription',
        content:
          'invalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContent',
        blogId: 'string',
      }

      await request(app)
        .post('/posts')
        .set('Authorization', authHeader)
        .send(invalidContent)
        .expect(400)

      await request(app).get('/posts').expect(200)

      //case invalid blogId
      const invalidBlogId: CreatePostModel = {
        title: 'title',
        shortDescription: 'shortDescription',
        content: 'content',
        blogId: '',
      }

      await request(app)
        .post('/posts')
        .set('Authorization', authHeader)
        .send(invalidBlogId)
        .expect(400)

      await request(app).get('/posts').expect(200)
    })

    it(`should update like status`, async () => {
      const data = {
        likeStatus: 'Like',
      }

      await request(app)
        .put(`/posts/${postId}/like-status`)
        .set('Authorization', BearerUserToken)
        .send(data)
        .expect(204)

      const updatedComment = await request(app)
        .get(`/posts/${postId}`)
        .expect(200)

      const responseBody = updatedComment.body

      expect(responseBody).toEqual({
        id: responseBody.id,
        title: responseBody.title,
        shortDescription: responseBody.shortDescription,
        content: responseBody.content,
        blogId: responseBody.blogId,
        blogName: responseBody.blogName,
        createdAt: responseBody.createdAt,
        extendedLikesInfo: {
          likesCount: 1,
          dislikesCount: 0,
          myStatus: 'None',
          newestLikes: [
            {
              addedAt: expect.any(String),
              login: createdUser.login,
              userId: createdUser.id,
            },
          ],
        },
      })
    })

    it(`should update like status`, async () => {
      const data = {
        likeStatus: 'Dislike',
      }

      await request(app)
        .put(`/posts/${postId}/like-status`)
        .set('Authorization', BearerUserToken)
        .send(data)
        .expect(204)

      const updatedComment = await request(app)
        .get(`/posts/${postId}`)
        .expect(200)

      const responseBody = updatedComment.body

      expect(responseBody).toEqual({
        id: responseBody.id,
        title: responseBody.title,
        shortDescription: responseBody.shortDescription,
        content: responseBody.content,
        blogId: responseBody.blogId,
        blogName: responseBody.blogName,
        createdAt: responseBody.createdAt,
        extendedLikesInfo: {
          likesCount: 0, // -1
          dislikesCount: 1, // +1
          myStatus: 'None',
          newestLikes: [],
        },
      })
    })

    it(`should update like status`, async () => {
      const data = {
        likeStatus: 'None',
      }

      await request(app)
        .put(`/posts/${postId}/like-status`)
        .set('Authorization', BearerUserToken)
        .send(data)
        .expect(204)

      const updatedComment = await request(app)
        .get(`/posts/${postId}`)
        .expect(200)

      const responseBody = updatedComment.body

      expect(responseBody).toEqual({
        id: responseBody.id,
        title: responseBody.title,
        shortDescription: responseBody.shortDescription,
        content: responseBody.content,
        blogId: responseBody.blogId,
        blogName: responseBody.blogName,
        createdAt: responseBody.createdAt,
        extendedLikesInfo: {
          likesCount: 0,
          dislikesCount: 0, //-1
          myStatus: 'None',
          newestLikes: [],
        },
      })
    })

    it(`GET -> "/posts/:postId": get post by unauthorized user. 
    Should return liked post with 'myStatus: None'; status 204; 
    used additional methods: POST => /blogs, POST => /posts, 
    PUT => /posts/:postId/like-status;`, async () => {
      const data = {
        likeStatus: 'Like',
      }

      await request(app)
        .put(`/posts/${postId}/like-status`)
        .set('Authorization', BearerUserToken)
        .send(data)
        .expect(204)

      const updatedComment = await request(app)
        .get(`/posts/${postId}`)
        .expect(200)

      const responseBody = updatedComment.body

      expect(responseBody).toEqual({
        id: responseBody.id,
        title: responseBody.title,
        shortDescription: responseBody.shortDescription,
        content: responseBody.content,
        blogId: responseBody.blogId,
        blogName: responseBody.blogName,
        createdAt: responseBody.createdAt,
        extendedLikesInfo: {
          likesCount: 1,
          dislikesCount: 0,
          myStatus: 'None',
          newestLikes: [
            {
              addedAt: expect.any(String),
              login: createdUser.login,
              userId: createdUser.id,
            },
          ],
        },
      })
    })
    //like-status ends

    let createdPost1: any = null
    let createdBlog1: any = null
    it(`should create blog with correct input data +
          should create post with correct input data + 
          shouldn't update blog with incorrect input data + 
          shouldn update blog with correct authorization data, input data +
          should delete blog by id with existing id +
          shouldn't delete blog by id with not existing id 
  `, async () => {
      //creating blog
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

      createdBlog1 = createBlogRequest.body

      expect(createdBlog1).toEqual({
        id: expect.any(String),
        name: blogData.name,
        description: blogData.description,
        websiteUrl: blogData.websiteUrl,
        createdAt: expect.any(String),
        isMembership: false,
      })

      //creating posts
      const data: CreatePostModel = {
        title: 'string',
        shortDescription: 'string',
        content: 'string',
        blogId: createdBlog1.id,
      }

      const createRequest = await request(app)
        .post('/posts')
        .set('Authorization', authHeader)
        .send(data)
        .expect(201)

      createdPost1 = createRequest.body

      expect(createdPost1).toEqual({
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

      //update title
      const emptyTitle: CreatePostModel = {
        title: '',
        shortDescription: 'string',
        content: 'string',
        blogId: 'string',
      }

      await request(app)
        .put(`${'/posts'}/${createdPost1.id}`)
        .set('Authorization', authHeader)
        .send(emptyTitle)
        .expect(400)

      //case2
      const invalidTitle: CreatePostModel = {
        title:
          'invalidTitleinvalidTitleinvalidTitleinvalidTitleinvalidTitleinvalidTitleinvalidTitleinvalidTitleinvalidTitle',
        shortDescription: 'string',
        content: 'string',
        blogId: 'string',
      }

      await request(app)
        .put(`${'/posts'}/${createdPost1.id}`)
        .set('Authorization', authHeader)
        .send(invalidTitle)
        .expect(400)

      //update shortDescription
      const emptyShortDescription: CreatePostModel = {
        title: '',
        shortDescription: '',
        content: 'string',
        blogId: 'string',
      }

      await request(app)
        .put(`${'/posts'}/${createdPost1.id}`)
        .set('Authorization', authHeader)
        .send(emptyShortDescription)
        .expect(400)

      //case2
      const invalidShortDescription: CreatePostModel = {
        title: 'title',
        shortDescription:
          'shortDescriptionshortDescriptionshortDescriptionshortDescriptionshortDescriptionshortDescriptionshortDescriptionshortDescriptionshortDescriptionshortDescriptionshortDescriptionshortDescriptionshortDescriptionshortDescriptionshortDescriptionshortDescriptionshortDescriptionshortDescription',
        content: 'string',
        blogId: 'string',
      }

      await request(app)
        .put(`${'/posts'}/${createdPost1.id}`)
        .set('Authorization', authHeader)
        .send(invalidShortDescription)
        .expect(400)

      //update content
      const emptyContent: CreatePostModel = {
        title: 'title',
        shortDescription: 'shortDescription',
        content: '',
        blogId: 'string',
      }

      await request(app)
        .put(`${'/posts'}/${createdPost1.id}`)
        .set('Authorization', authHeader)
        .send(emptyContent)
        .expect(400)

      //case2
      const invalidContent: CreatePostModel = {
        title: 'title',
        shortDescription: 'shortDescription',
        content:
          'stringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstringstring',
        blogId: 'string',
      }

      await request(app)
        .put(`${'/posts'}/${createdPost1.id}`)
        .set('Authorization', authHeader)
        .send(invalidContent)
        .expect(400)

      //update blogId
      const emptyBlogId: CreatePostModel = {
        title: 'title',
        shortDescription: 'shortDescription',
        content: 'content',
        blogId: '',
      }

      await request(app)
        .put(`${'/posts'}/${createdPost1.id}`)
        .set('Authorization', authHeader)
        .send(emptyBlogId)
        .expect(400)

      //case2
      const invalidBlogId: any = {
        title: 'title',
        shortDescription: 'shortDescription',
        content: 'content',
        blogId: 1,
      }

      await request(app)
        .put(`${'/posts'}/${createdPost1.id}`)
        .set('Authorization', authHeader)
        .send(invalidBlogId)
        .expect(400)

      //update posts with valida data
      await request(app)
        .put(`${'/posts'}/${createdPost1.id}`)
        .set('Authorization', authHeader)
        .send(data)
        .expect(204)

      //delete post by id
      await request(app)
        .delete(`${'/posts'}/${createdPost1.id}`)
        .set('Authorization', authHeader)
        .send(data)
        .expect(204)

      //case invalid id
      await request(app)
        .delete(`${'/posts'}/12`)
        .set('Authorization', authHeader)
        .send(data)
        .expect(404)
    })
  })
})
