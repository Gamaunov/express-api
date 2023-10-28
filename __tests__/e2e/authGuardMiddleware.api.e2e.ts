import request from 'supertest'

import { CreateBlogModel } from '../../src/models'
import { RouterPath } from '../../src/shared'

const getRequest = () => {
  return request('http://localhost:5000/')
}

function encodeCredentials(username: string, password: string) {
  const credentials = `${username}:${password}`
  const encodedCredentials = Buffer.from(credentials).toString('base64')
  return `Basic ${encodedCredentials}`
}

describe('authGuardMiddleware', () => {
  beforeAll(async () => {
    await getRequest().delete(`${RouterPath}/all-data`)
  })

  it(` shouldn't create blog with incorrect authorization data`, async () => {
    const data: CreateBlogModel = {
      name: 'string',
      description: 'string',
      websiteUrl: 'https://google.com',
    }

    const username = ''
    const password = 'qwerty'

    const authHeader = encodeCredentials(username, password)

    await getRequest()
      .post('blogs')
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
    const password = 'qwerty'

    const authHeader = encodeCredentials(username, password)

    await getRequest()
      .post('blogs')
      .set('Authorization', authHeader)
      .send(data)
      .expect(401)

    await getRequest().get('blogs').expect(200)
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

    await getRequest()
      .post('blogs')
      .set('Authorization', authHeader)
      .send(data)
      .expect(401)

    await getRequest().get('blogs').expect(200)
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
      .post('blogs')
      .set('Authorization', authHeader)
      .send(data)
      .expect(401)

    await getRequest().get('blogs').expect(200)
  })

  afterAll((done) => {
    done()
  })
})
