import dotenv from 'dotenv'
import mongoose from 'mongoose'
import request from 'supertest'

import { app } from '../../src/app'
import { CreateBlogModel, CreatePostModel } from '../../src/models'
import { authHeader, encodeCredentials } from '../helpers.test'

dotenv.config()

const mongoURI: string = process.env.MONGO_URI || `mongodb://0.0.0.0:27017/test`

if (!mongoURI) throw new Error('mongoURI not found')

const EmptyOutput = {
  pagesCount: 0,
  page: 1,
  pageSize: 10,
  totalCount: 0,
  items: [],
}

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

    it('should return 200 and empty array', async () => {
      await request(app).get('/posts').expect(200, EmptyOutput)
    })

    it(`should return 404 for not existing post`, async () => {
      await request(app).get(`${'/posts'}/5`).expect(404)
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

    let createdPost: any = null
    let createdBlog: any = null
    it(`should create blog with correct input data +
  should create post with correct input data + 
  shouldn't update blog with incorrect input data + 
  shouldn update blog with correct authorization data, input data +
  should delete blog by id with existing id +
  shouldn't delete blog by id with not existing id 
  `, async () => {
      const username = 'admin'
      const password = 'qwerty'
      const authHeader = encodeCredentials(username, password)

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

      //update title
      const emptyTitle: CreatePostModel = {
        title: '',
        shortDescription: 'string',
        content: 'string',
        blogId: 'string',
      }

      await request(app)
        .put(`${'/posts'}/${createdPost.id}`)
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
        .put(`${'/posts'}/${createdPost.id}`)
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
        .put(`${'/posts'}/${createdPost.id}`)
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
        .put(`${'/posts'}/${createdPost.id}`)
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
        .put(`${'/posts'}/${createdPost.id}`)
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
        .put(`${'/posts'}/${createdPost.id}`)
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
        .put(`${'/posts'}/${createdPost.id}`)
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
        .put(`${'/posts'}/${createdPost.id}`)
        .set('Authorization', authHeader)
        .send(invalidBlogId)
        .expect(400)

      //update posts with valida data
      await request(app)
        .put(`${'/posts'}/${createdPost.id}`)
        .set('Authorization', authHeader)
        .send(data)
        .expect(204)

      //delete post by id
      await request(app)
        .delete(`${'/posts'}/${createdPost.id}`)
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
