import mongoose from 'mongoose'
import request from 'supertest'

import { app } from '../../src/app'
import { CreateBlogModel } from '../../src/models'
import { RouterPath } from '../../src/shared'
import { encodeCredentials, password, username } from '../helpers.test'

const mongoURI: string = process.env.MONGO_URI || `mongodb://0.0.0.0:27017/test`

if (!mongoURI) throw new Error('mongoURI not found')

describe('authGuardMiddleware', () => {
  beforeAll(async () => {
    await mongoose.connect(mongoURI)
    await request(app).delete('/testing/all-data')
  })

  afterAll(async () => {
    await mongoose.connection.close()
  })

  describe('authGuardMiddleware', () => {
    beforeAll(async () => {
      await request(app).delete(`//${RouterPath}/all-data`)
    })

    it(` shouldn't create blog with incorrect authorization data`, async () => {
      const data: CreateBlogModel = {
        name: 'string',
        description: 'string',
        websiteUrl: 'https://google.com',
      }

      const username = ''

      const authHeader = encodeCredentials(username, password)

      await request(app)
        .post('/blogs')
        .set('Authorization', authHeader)
        .send(data)
        .expect(401)
    })

    it(`shouldn't create blog with incorrect authorization // username`, async () => {
      const data: CreateBlogModel = {
        name: 'string',
        description: 'string',
        websiteUrl: 'https://google.com',
      }

      const username = 'sudoadmin'

      const authHeader = encodeCredentials(username, password)

      await request(app)
        .post('/blogs')
        .set('Authorization', authHeader)
        .send(data)
        .expect(401)

      await request(app).get('/blogs').expect(200)
    })

    it(`shouldn't create blog with incorrect authorization`, async () => {
      const data: CreateBlogModel = {
        name: 'string',
        description: 'string',
        websiteUrl: 'https://google.com',
      }

      const username = 'sudoadmin'
      const password = ''

      const authHeader = encodeCredentials(username, password)

      await request(app)
        .post('/blogs')
        .set('Authorization', authHeader)
        .send(data)
        .expect(401)

      await request(app).get('/blogs').expect(200)
    })

    it(`shouldn't create blog with incorrect authorization // password`, async () => {
      const data: CreateBlogModel = {
        name: 'string',
        description: 'string',
        websiteUrl: 'https://google.com',
      }

      const password = 'qwertyu'

      const authHeader = encodeCredentials(username, password)

      await request(app)
        .post('/blogs')
        .set('Authorization', authHeader)
        .send(data)
        .expect(401)

      await request(app).get('/blogs').expect(200)
    })
  })
})
