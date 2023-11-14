import dotenv from 'dotenv'
import mongoose from 'mongoose'
import request from 'supertest'

import { app } from '../../src/app'
import { CreateBlogModel } from '../../src/models'
import { authHeader, encodeCredentials } from '../helpers.test'

dotenv.config()

const mongoURI: string = process.env.MONGO_URI || `mongodb://0.0.0.0:27017/test`

if (!mongoURI) throw new Error('mongoURI not found')

let createdBlog: any = null
let createdPost: any = null

describe('Blogs router', () => {
  beforeAll(async () => {
    await mongoose.connect(mongoURI)
    await request(app).delete('/testing/all-data')
  })

  afterAll(async () => {
    await mongoose.connection.close()
  })

  describe('blogs', () => {
    beforeAll(async () => {
      await request(app).delete(`${'/testing'}/all-data`)
    })

    it('should return 200 and empty array blogs', async () => {
      await request(app).get('/blogs').expect(200, {
        pagesCount: 0,
        page: 1,
        pageSize: 10,
        totalCount: 0,
        items: [],
      })
    })

    it(`should create blog`, async () => {
      const blogData = {
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
      const data = {
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

    it(`should return 404 for not existing blog`, async () => {
      await request(app).get(`${'/blogs'}/5`).expect(404)
    })

    it(`shouldn't create blog with incorrect input data, field: websiteUrl`, async () => {
      const data: CreateBlogModel = {
        name: 'string',
        description:
          'string>500_ierutioertweiurtierutewotruwoierierutioertweiurtierutewotruwoierierutioertweiurtierutewotruwoierierutioertweiurtierutewotruwoieroertweiurtierutewotruwoierierutioertweiurtierutewotruwoierierutioertweiurtierutewotruwoieroertweiurtierutewotruwoierierutioertweiurtierutewotruwoierierutioertweiurtierutewotruwoieroertweiurtierutewotruwoierierutioertweiurtierutewotruwoierierutioertweiurtierutewotruwoieroertweiurtierutewotruwoierierutioertweiurtierutewotruwoierierutioertweiurtierutewotruwoieroertweiurtierutewotruwoierierutioertweiurtierutewotruwoierierutioertweiurtierutewotruwoieroertweiurtierutewotruwoierierutioertweiurtierutewotruwoierierutioertweiurtierutewotruwoieroertweiurtierutewotruwoierierutioertweiurtierutewotruwoierierutioertweiurtierutewotruwoieroertweiurtierutewotruwoierierutioertweiurtierutewotruwoierierutioertweiurtierutewotruwoieroertweiurtierutewotruwoierierutioertweiurtierutewotruwoierierutioertweiurtierutewotruwoieroertweiurtierutewotruwoierierutioertweiurtierutewotruwoierierutioertweiurtierutewotruwoieroertweiurtierutewotruwoierierutioertweiurtierutewotruwoierierutioertweiurtierutewotruwoier',
        websiteUrl: 'http://incorrectcom',
      }

      const username = 'admin'
      const password = 'qwerty'

      const authHeader = encodeCredentials(username, password)

      await request(app)
        .post('/blogs')
        .set('Authorization', authHeader)
        .send(data)
        .expect(400)

      await request(app).get('/blogs').expect(200)
    })

    it(`shouldn't update blog with incorrect input data - name`, async () => {
      //update name
      const updatedDataName: CreateBlogModel = {
        name: '',
        description: 'string',
        websiteUrl: 'https://google.com',
      }

      await request(app)
        .put(`${'/blogs'}/${createdBlog.id}`)
        .set('Authorization', authHeader)
        .send(updatedDataName)
        .expect(400)

      //case2
      const updatedDataNameMaxLength: CreateBlogModel = {
        name: 'updatedDataNameMaxLengthupdatedDataNameMaxLengthupdatedDataNameMaxLengthupdatedDataNameMaxLength',
        description: 'string',
        websiteUrl: 'https://google.com',
      }

      await request(app)
        .put(`${'/blogs'}/${createdBlog.id}`)
        .set('Authorization', authHeader)
        .send(updatedDataNameMaxLength)
        .expect(400)
    })

    it(`shouldn't update blog with incorrect input data - description`, async () => {
      //update description
      const updatedDataDescription: CreateBlogModel = {
        name: 'string',
        description: '',
        websiteUrl: 'https://google.com',
      }

      await request(app)
        .put(`${'/blogs'}/${createdBlog.id}`)
        .set('Authorization', authHeader)
        .send(updatedDataDescription)
        .expect(400)

      await request(app).get(`${'/blogs'}/${createdBlog.id}`).expect(200)

      //case2
      const updatedDataDescriptionMaxLength: CreateBlogModel = {
        name: 'string',
        description:
          'updatedDataDescriptionMaxLengthupdatedDataDescriptionMaxLengthupdatedDataDescriptionMaxLengthupdatedDataDescriptionMaxLengthupdatedDataDescriptionMaxLengthupdatedDataDescriptionMaxLengthupdatedDataDescriptionMaxLengthupdatedDataDescriptionMaxLengthupdatedDataDescriptionMaxLengthupdatedDataDescriptionMaxLengthupdatedDataDescriptionMaxLengthupdatedDataDescriptionMaxLengthupdatedDataDescriptionMaxLengthupdatedDataDescriptionMaxLengthupdatedDataDescriptionMaxLengthupdatedDataDescriptionMaxLengthupdatedDataDescriptionMaxLengthupdatedDataDescriptionMaxLengthupdatedDataDescriptionMaxLengthupdatedDataDescriptionMaxLengthupdatedDataDescriptionMaxLengthupdatedDataDescriptionMaxLengthupdatedDataDescriptionMaxLengthupdatedDataDescriptionMaxLengthupdatedDataDescriptionMaxLengthupdatedDataDescriptionMaxLengthupdatedDataDescriptionMaxLength',
        websiteUrl: 'https://google.com',
      }

      await request(app)
        .put(`${'/blogs'}/${createdBlog.id}`)
        .set('Authorization', authHeader)
        .send(updatedDataDescriptionMaxLength)
        .expect(400)
    })

    it(`shouldn't update blog with incorrect input data - websiteUrl`, async () => {
      //update websiteUrl
      const updatedDataWebsiteUrl: CreateBlogModel = {
        name: 'string',
        description: 'string',
        websiteUrl: 'https://googlecom',
      }

      await request(app)
        .put(`${'/blogs'}/${createdBlog.id}`)
        .set('Authorization', authHeader)
        .send(updatedDataWebsiteUrl)
        .expect(400)

      await request(app).get(`${'/blogs'}/${createdBlog.id}`).expect(200)

      //case2
      const updatedDataWebsiteUrlMaxLength: CreateBlogModel = {
        name: 'string',
        description: 'string',
        websiteUrl:
          'https://googlegooglegooglegooglegooglegooglegooglegooglegooglegooglegooglegooglegooglegooglegooglegooglegooglegooglegooglegooglegooglegooglegooglegoogle.com',
      }

      await request(app)
        .put(`${'/blogs'}/${createdBlog.id}`)
        .set('Authorization', authHeader)
        .send(updatedDataWebsiteUrlMaxLength)
        .expect(400)
    })

    it(`should update blog with correct authorization data, input data`, async () => {
      //update blog with valid data
      const validData: CreateBlogModel = {
        name: 'string',
        description: 'string',
        websiteUrl: 'https://google.com',
      }

      await request(app)
        .put(`${'/blogs'}/${createdBlog.id}`)
        .set('Authorization', authHeader)
        .send(validData)
        .expect(204)
    })

    it(`create post for specific blog`, async () => {
      //create post for specific blog
      const dataForCreatingBlog = {
        title: 'title',
        shortDescription: 'shortDescription',
        content: 'content',
      }

      const createdBlogById = await request(app)
        .post(`/blogs/${createdBlog.id}/posts`)
        .set('Authorization', authHeader)
        .send(dataForCreatingBlog)
        .expect(201)

      const responseBody = createdBlogById.body

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
          dislikesCount: 0,
          myStatus: 'None',
          newestLikes: [],
        },
      })
    })

    it(`shouldn't delete blog by id with not existing id`, async () => {
      //case invalid id
      const validData: CreateBlogModel = {
        name: 'string',
        description: 'string',
        websiteUrl: 'https://google.com',
      }

      await request(app)
        .delete(`${'/blogs'}/33`)
        .set('Authorization', authHeader)
        .send(validData)
        .expect(404)
    })

    it('should delete blog by id with existing id', async () => {
      //delete blog by id
      const validData: CreateBlogModel = {
        name: 'string',
        description: 'string',
        websiteUrl: 'https://google.com',
      }

      await request(app)
        .delete(`${'/blogs'}/${createdBlog.id}`)
        .set('Authorization', authHeader)
        .send(validData)
        .expect(204)
    })
  })
})
