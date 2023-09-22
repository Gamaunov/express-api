import request from 'supertest'

import { app } from '../../src/app'
import { CreateBlogModel } from '../../src/models/blogs/CreatBlogModel'
import { RouterPath } from '../../src/shared/utils/router-path'

const getRequest = () => {
  return request(app)
}

function encodeCredentials(username: string, password: string) {
  const credentials = `${username}:${password}`
  const encodedCredentials = Buffer.from(credentials).toString('base64')
  return `Basic ${encodedCredentials}`
}

describe('posts', () => {
  beforeAll(async () => {
    await getRequest().delete(`${RouterPath.testing}/all-data`)
  })

  it(` shouldn't update blog with incorrect authorization data`, async () => {
    const data: CreateBlogModel = {
      name: 'string',
      description: 'string',
      websiteUrl: 'https://google.com',
    }

    const username = ''
    const password = 'qwerty'

    const authHeader = encodeCredentials(username, password)

    await getRequest()
      .post(RouterPath.blogs)
      .set('Authorization', authHeader)
      .send(data)
      .expect(401)

    await getRequest().get(RouterPath.blogs).expect(200)
  })

  it(`shouldn't create blog with incorrect authorization // username`, async () => {
    const data: CreateBlogModel = {
      name: 'string',
      description: 'string',
      websiteUrl: 'https://google.com',
    }

    const username = 'sudoadmin'
    const password = 'qwerty'

    const authHeader = encodeCredentials(username, password)

    await getRequest()
      .post(RouterPath.blogs)
      .set('Authorization', authHeader)
      .send(data)
      .expect(401)

    await getRequest().get(RouterPath.blogs).expect(200)
  })

  it(`shouldn't create blog with incorrect authorization // password`, async () => {
    const data: CreateBlogModel = {
      name: 'string',
      description: 'string',
      websiteUrl: 'https://google.com',
    }

    const username = 'admin'
    const password = ''

    const authHeader = encodeCredentials(username, password)

    await getRequest()
      .post(RouterPath.blogs)
      .set('Authorization', authHeader)
      .send(data)
      .expect(401)

    await getRequest().get(RouterPath.blogs).expect(200)
  })

  it(`shouldn't create blog with incorrect authorization // password`, async () => {
    const data: CreateBlogModel = {
      name: 'string',
      description: 'string',
      websiteUrl: 'https://google.com',
    }

    const username = 'admin'
    const password = 'qwertyu'

    const authHeader = encodeCredentials(username, password)

    await getRequest()
      .post(RouterPath.blogs)
      .set('Authorization', authHeader)
      .send(data)
      .expect(401)

    await getRequest().get(RouterPath.blogs).expect(200)
  })

  afterAll((done) => {
    done()
  })
})
