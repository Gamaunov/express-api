import request from 'supertest'

import { app } from '../../src/app'
import { CreateBlogModel } from '../../src/models/blogs/CreatBlogModel'
import { HTTP_STATUSES } from '../../src/shared/utils/http-statuses'
import { RouterPath } from '../../src/shared/utils/router-path'

const getRequest = () => {
  return request(app)
}

function encodeCredentials(username: string, password: string) {
  const credentials = `${username}:${password}`
  const encodedCredentials = Buffer.from(credentials).toString('base64')
  return `Basic ${encodedCredentials}`
}

describe('blogs', () => {
  beforeAll(async () => {
    await getRequest().delete(`${RouterPath.testing}/all-data`)
  })

  it('should return 200 and empty array', async () => {
    await getRequest().get(RouterPath.blogs).expect(HTTP_STATUSES.OK_200, [])
  })

  it(`should return 404 for not existing blog`, async () => {
    await getRequest().get(`${RouterPath.blogs}/5`).expect(404)
  })

  it(`shouldn't create blog with incorrect input data //field: name`, async () => {
    const data: CreateBlogModel = {
      name: '',
      description: 'string',
      websiteUrl: 'https://google.com',
    }

    const username = 'admin'
    const password = 'qwerty'

    const authHeader = encodeCredentials(username, password)

    await getRequest()
      .post(RouterPath.blogs)
      .set('Authorization', authHeader)
      .send(data)
      .expect(400)

    await getRequest().get(RouterPath.blogs).expect(200)
  })

  it(`shouldn't create blog with incorrect input data //field: name`, async () => {
    const data: CreateBlogModel = {
      name: 'string>15_createcreatecreatecreatecreatecreatecreatecreatecreate',
      description: 'string',
      websiteUrl: 'https://google.com',
    }

    const username = 'admin'
    const password = 'qwerty'

    const authHeader = encodeCredentials(username, password)

    await getRequest()
      .post(RouterPath.blogs)
      .set('Authorization', authHeader)
      .send(data)
      .expect(400)

    await getRequest().get(RouterPath.blogs).expect(200)
  })

  it(`shouldn't create blog with incorrect input data //field: description`, async () => {
    const data: CreateBlogModel = {
      name: 'string',
      description: '',
      websiteUrl: 'https://google.com',
    }

    const username = 'admin'
    const password = 'qwerty'

    const authHeader = encodeCredentials(username, password)

    await getRequest()
      .post(RouterPath.blogs)
      .set('Authorization', authHeader)
      .send(data)
      .expect(400)

    await getRequest().get(RouterPath.blogs).expect(200)
  })

  it(`shouldn't create blog with incorrect input data //field: description`, async () => {
    const data: CreateBlogModel = {
      name: 'string',
      description:
        'string>500_ierutioertweiurtierutewotruwoierierutioertweiurtierutewotruwoierierutioertweiurtierutewotruwoierierutioertweiurtierutewotruwoieroertweiurtierutewotruwoierierutioertweiurtierutewotruwoierierutioertweiurtierutewotruwoieroertweiurtierutewotruwoierierutioertweiurtierutewotruwoierierutioertweiurtierutewotruwoieroertweiurtierutewotruwoierierutioertweiurtierutewotruwoierierutioertweiurtierutewotruwoieroertweiurtierutewotruwoierierutioertweiurtierutewotruwoierierutioertweiurtierutewotruwoieroertweiurtierutewotruwoierierutioertweiurtierutewotruwoierierutioertweiurtierutewotruwoieroertweiurtierutewotruwoierierutioertweiurtierutewotruwoierierutioertweiurtierutewotruwoieroertweiurtierutewotruwoierierutioertweiurtierutewotruwoierierutioertweiurtierutewotruwoieroertweiurtierutewotruwoierierutioertweiurtierutewotruwoierierutioertweiurtierutewotruwoieroertweiurtierutewotruwoierierutioertweiurtierutewotruwoierierutioertweiurtierutewotruwoieroertweiurtierutewotruwoierierutioertweiurtierutewotruwoierierutioertweiurtierutewotruwoieroertweiurtierutewotruwoierierutioertweiurtierutewotruwoierierutioertweiurtierutewotruwoier',
      websiteUrl: 'https://google.com',
    }

    const username = 'admin'
    const password = 'qwerty'

    const authHeader = encodeCredentials(username, password)

    await getRequest()
      .post(RouterPath.blogs)
      .set('Authorization', authHeader)
      .send(data)
      .expect(400)

    await getRequest().get(RouterPath.blogs).expect(200)
  })

  it(`shouldn't create blog with incorrect input data //field: websiteUrl`, async () => {
    const data: CreateBlogModel = {
      name: 'string',
      description:
        'string>500_ierutioertweiurtierutewotruwoierierutioertweiurtierutewotruwoierierutioertweiurtierutewotruwoierierutioertweiurtierutewotruwoieroertweiurtierutewotruwoierierutioertweiurtierutewotruwoierierutioertweiurtierutewotruwoieroertweiurtierutewotruwoierierutioertweiurtierutewotruwoierierutioertweiurtierutewotruwoieroertweiurtierutewotruwoierierutioertweiurtierutewotruwoierierutioertweiurtierutewotruwoieroertweiurtierutewotruwoierierutioertweiurtierutewotruwoierierutioertweiurtierutewotruwoieroertweiurtierutewotruwoierierutioertweiurtierutewotruwoierierutioertweiurtierutewotruwoieroertweiurtierutewotruwoierierutioertweiurtierutewotruwoierierutioertweiurtierutewotruwoieroertweiurtierutewotruwoierierutioertweiurtierutewotruwoierierutioertweiurtierutewotruwoieroertweiurtierutewotruwoierierutioertweiurtierutewotruwoierierutioertweiurtierutewotruwoieroertweiurtierutewotruwoierierutioertweiurtierutewotruwoierierutioertweiurtierutewotruwoieroertweiurtierutewotruwoierierutioertweiurtierutewotruwoierierutioertweiurtierutewotruwoieroertweiurtierutewotruwoierierutioertweiurtierutewotruwoierierutioertweiurtierutewotruwoier',
      websiteUrl: '',
    }

    const username = 'admin'
    const password = 'qwerty'

    const authHeader = encodeCredentials(username, password)

    await getRequest()
      .post(RouterPath.blogs)
      .set('Authorization', authHeader)
      .send(data)
      .expect(400)

    await getRequest().get(RouterPath.blogs).expect(200)
  })

  it(`shouldn't create blog with incorrect input data //field: websiteUrl`, async () => {
    const data: CreateBlogModel = {
      name: 'string',
      description:
        'string>500_ierutioertweiurtierutewotruwoierierutioertweiurtierutewotruwoierierutioertweiurtierutewotruwoierierutioertweiurtierutewotruwoieroertweiurtierutewotruwoierierutioertweiurtierutewotruwoierierutioertweiurtierutewotruwoieroertweiurtierutewotruwoierierutioertweiurtierutewotruwoierierutioertweiurtierutewotruwoieroertweiurtierutewotruwoierierutioertweiurtierutewotruwoierierutioertweiurtierutewotruwoieroertweiurtierutewotruwoierierutioertweiurtierutewotruwoierierutioertweiurtierutewotruwoieroertweiurtierutewotruwoierierutioertweiurtierutewotruwoierierutioertweiurtierutewotruwoieroertweiurtierutewotruwoierierutioertweiurtierutewotruwoierierutioertweiurtierutewotruwoieroertweiurtierutewotruwoierierutioertweiurtierutewotruwoierierutioertweiurtierutewotruwoieroertweiurtierutewotruwoierierutioertweiurtierutewotruwoierierutioertweiurtierutewotruwoieroertweiurtierutewotruwoierierutioertweiurtierutewotruwoierierutioertweiurtierutewotruwoieroertweiurtierutewotruwoierierutioertweiurtierutewotruwoierierutioertweiurtierutewotruwoieroertweiurtierutewotruwoierierutioertweiurtierutewotruwoierierutioertweiurtierutewotruwoier',
      websiteUrl: 'http://incorrectcom',
    }

    const username = 'admin'
    const password = 'qwerty'

    const authHeader = encodeCredentials(username, password)

    await getRequest()
      .post(RouterPath.blogs)
      .set('Authorization', authHeader)
      .send(data)
      .expect(400)

    await getRequest().get(RouterPath.blogs).expect(200)
  })

  let createdBlog: any = null

  it(`should create blog with correct input data + 
  shouldn't update blog with incorrect input data + 
  shouldn't update blog with incorrect authorization data +
  should update blog with correct authorization data, input data +
  should delete blog by id with existing id +
  shouldn't delete blog by id with not existing id 
  `, async () => {
    const data: CreateBlogModel = {
      name: 'string',
      description: 'string',
      websiteUrl: 'https://google.com',
    }

    const username = 'admin'
    const password = 'qwerty'

    const authHeader = encodeCredentials(username, password)

    const createRequest = await getRequest()
      .post(RouterPath.blogs)
      .set('Authorization', authHeader)
      .send(data)
      .expect(201)

    createdBlog = createRequest.body

    expect(createdBlog).toEqual({
      id: expect.any(String),
      name: data.name,
      description: data.description,
      websiteUrl: data.websiteUrl,
      createdAt: expect.any(String),
      isMembership: false,
    })

    const getBlogsRequest = await getRequest().get(RouterPath.blogs).expect(200)

    expect(getBlogsRequest.body).toContainEqual(createdBlog)

    //incorrect authorization data
    //case incorrect username
    const updatedUsername = 'incorrect'

    const updatedAuthUsername = encodeCredentials(updatedUsername, password)

    await getRequest()
      .put(`${RouterPath.blogs}/${createdBlog.id}`)
      .set('Authorization', updatedAuthUsername)
      .send(data)
      .expect(401)

    //case incorrect username 2
    const updatedEmptyUsername = ''

    const updatedAuthUsername2 = encodeCredentials(
      updatedEmptyUsername,
      password,
    )

    await getRequest()
      .put(`${RouterPath.blogs}/${createdBlog.id}`)
      .set('Authorization', updatedAuthUsername2)
      .send(data)
      .expect(401)

    //case incorrect password
    const updatedPassword = 'incorrect'

    const updatedAuthHeader = encodeCredentials(username, updatedPassword)

    await getRequest()
      .put(`${RouterPath.blogs}/${createdBlog.id}`)
      .set('Authorization', updatedAuthHeader)
      .send(data)
      .expect(401)

    //case incorrect password 2
    const updatedEmptyPassword = ''

    const updatedAuthHeader2 = encodeCredentials(username, updatedEmptyPassword)

    await getRequest()
      .put(`${RouterPath.blogs}/${createdBlog.id}`)
      .set('Authorization', updatedAuthHeader2)
      .send(data)
      .expect(401)

    //update name
    const updatedDataName: CreateBlogModel = {
      name: '',
      description: 'string',
      websiteUrl: 'https://google.com',
    }

    await getRequest()
      .put(`${RouterPath.blogs}/${createdBlog.id}`)
      .set('Authorization', authHeader)
      .send(updatedDataName)
      .expect(400)

    await getRequest().get(`${RouterPath.blogs}/${createdBlog.id}`).expect(200)

    //case2
    const updatedDataNameMaxLength: CreateBlogModel = {
      name: 'updatedDataNameMaxLengthupdatedDataNameMaxLengthupdatedDataNameMaxLengthupdatedDataNameMaxLength',
      description: 'string',
      websiteUrl: 'https://google.com',
    }

    await getRequest()
      .put(`${RouterPath.blogs}/${createdBlog.id}`)
      .set('Authorization', authHeader)
      .send(updatedDataNameMaxLength)
      .expect(400)

    await getRequest().get(`${RouterPath.blogs}/${createdBlog.id}`).expect(200)

    //update description
    const updatedDataDescription: CreateBlogModel = {
      name: 'string',
      description: '',
      websiteUrl: 'https://google.com',
    }

    await getRequest()
      .put(`${RouterPath.blogs}/${createdBlog.id}`)
      .set('Authorization', authHeader)
      .send(updatedDataDescription)
      .expect(400)

    await getRequest().get(`${RouterPath.blogs}/${createdBlog.id}`).expect(200)

    //case2
    const updatedDataDescriptionMaxLength: CreateBlogModel = {
      name: 'string',
      description:
        'updatedDataDescriptionMaxLengthupdatedDataDescriptionMaxLengthupdatedDataDescriptionMaxLengthupdatedDataDescriptionMaxLengthupdatedDataDescriptionMaxLengthupdatedDataDescriptionMaxLengthupdatedDataDescriptionMaxLengthupdatedDataDescriptionMaxLengthupdatedDataDescriptionMaxLengthupdatedDataDescriptionMaxLengthupdatedDataDescriptionMaxLengthupdatedDataDescriptionMaxLengthupdatedDataDescriptionMaxLengthupdatedDataDescriptionMaxLengthupdatedDataDescriptionMaxLengthupdatedDataDescriptionMaxLengthupdatedDataDescriptionMaxLengthupdatedDataDescriptionMaxLengthupdatedDataDescriptionMaxLengthupdatedDataDescriptionMaxLengthupdatedDataDescriptionMaxLengthupdatedDataDescriptionMaxLengthupdatedDataDescriptionMaxLengthupdatedDataDescriptionMaxLengthupdatedDataDescriptionMaxLengthupdatedDataDescriptionMaxLengthupdatedDataDescriptionMaxLength',
      websiteUrl: 'https://google.com',
    }

    await getRequest()
      .put(`${RouterPath.blogs}/${createdBlog.id}`)
      .set('Authorization', authHeader)
      .send(updatedDataDescriptionMaxLength)
      .expect(400)

    await getRequest().get(`${RouterPath.blogs}/${createdBlog.id}`).expect(200)

    //update websiteUrl
    const updatedDataWebsiteUrl: CreateBlogModel = {
      name: 'string',
      description: 'string',
      websiteUrl: 'https://googlecom',
    }

    await getRequest()
      .put(`${RouterPath.blogs}/${createdBlog.id}`)
      .set('Authorization', authHeader)
      .send(updatedDataWebsiteUrl)
      .expect(400)

    await getRequest().get(`${RouterPath.blogs}/${createdBlog.id}`).expect(200)

    //case2
    const updatedDataWebsiteUrlMaxLength: CreateBlogModel = {
      name: 'string',
      description: 'string',
      websiteUrl:
        'https://googlegooglegooglegooglegooglegooglegooglegooglegooglegooglegooglegooglegooglegooglegooglegooglegooglegooglegooglegooglegooglegooglegooglegoogle.com',
    }

    await getRequest()
      .put(`${RouterPath.blogs}/${createdBlog.id}`)
      .set('Authorization', authHeader)
      .send(updatedDataWebsiteUrlMaxLength)
      .expect(400)

    await getRequest().get(`${RouterPath.blogs}/${createdBlog.id}`).expect(200)

    //update blog with valid data
    const validData: CreateBlogModel = {
      name: 'string',
      description: 'string',
      websiteUrl: 'https://google.com',
    }

    await getRequest()
      .put(`${RouterPath.blogs}/${createdBlog.id}`)
      .set('Authorization', authHeader)
      .send(validData)
      .expect(204)

    await getRequest().get(`${RouterPath.blogs}/${createdBlog.id}`).expect(200)

    //delete blog by id
    await getRequest()
      .delete(`${RouterPath.blogs}/${createdBlog.id}`)
      .set('Authorization', authHeader)
      .send(validData)
      .expect(204)

    //case invalid id
    await getRequest()
      .delete(`${RouterPath.blogs}/33`)
      .set('Authorization', authHeader)
      .send(validData)
      .expect(404)
  })
  
  afterAll((done) => {
    done()
  })
})
