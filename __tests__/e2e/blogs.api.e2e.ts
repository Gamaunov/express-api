import request from 'supertest'

import { CreateBlogModel, CreatePostModel } from '../../src/models'

const getRequest = () => {
  return request('http://localhost:5000/')
}

function encodeCredentials(username: string, password: string) {
  const credentials = `${username}:${password}`
  const encodedCredentials = Buffer.from(credentials).toString('base64')
  return `Basic ${encodedCredentials}`
}

const username = 'admin'
const password = 'qwerty'
const authHeader = encodeCredentials(username, password)

let createdBlog: any = null
let createdPost: any = null

describe('blogs', () => {
  beforeAll(async () => {
    await getRequest().delete(`${'testing'}/all-data`)
  })

  beforeEach(async () => {
    //creating blog
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
  })

  it(`should return 404 for not existing blog`, async () => {
    await getRequest().get(`${'blogs'}/5`).expect(404)
  })

  it(`shouldn't create blog with incorrect input data`, async () => {
    const data: CreateBlogModel = {
      name: '',
      description: 'string',
      websiteUrl: 'https://google.com',
    }

    const username = 'admin'
    const password = 'qwerty'

    const authHeader = encodeCredentials(username, password)

    await getRequest()
      .post('blogs')
      .set('Authorization', authHeader)
      .send(data)
      .expect(400)

    await getRequest().get('blogs').expect(200)
  })

  it(`shouldn't create blog with incorrect input data`, async () => {
    const data: CreateBlogModel = {
      name: 'string>15_createcreatecreatecreatecreatecreatecreatecreatecreate',
      description: 'string',
      websiteUrl: 'https://google.com',
    }

    const username = 'admin'
    const password = 'qwerty'

    const authHeader = encodeCredentials(username, password)

    await getRequest()
      .post('blogs')
      .set('Authorization', authHeader)
      .send(data)
      .expect(400)

    await getRequest().get('blogs').expect(200)
  })

  it(`shouldn't create blog with incorrect input data`, async () => {
    const data: CreateBlogModel = {
      name: 'string',
      description: '',
      websiteUrl: 'https://google.com',
    }

    const username = 'admin'
    const password = 'qwerty'

    const authHeader = encodeCredentials(username, password)

    await getRequest()
      .post('blogs')
      .set('Authorization', authHeader)
      .send(data)
      .expect(400)

    await getRequest().get('blogs').expect(200)
  })

  it(`shouldn't create blog with incorrect input data`, async () => {
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
      .post('blogs')
      .set('Authorization', authHeader)
      .send(data)
      .expect(400)

    await getRequest().get('blogs').expect(200)
  })

  it(`shouldn't create blog with incorrect input data`, async () => {
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
      .post('blogs')
      .set('Authorization', authHeader)
      .send(data)
      .expect(400)

    await getRequest().get('blogs').expect(200)
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

    await getRequest()
      .post('blogs')
      .set('Authorization', authHeader)
      .send(data)
      .expect(400)

    await getRequest().get('blogs').expect(200)
  })

  it(`shouldn't update blog with incorrect input data - name`, async () => {
    //update name
    const updatedDataName: CreateBlogModel = {
      name: '',
      description: 'string',
      websiteUrl: 'https://google.com',
    }

    await getRequest()
      .put(`${'blogs'}/${createdBlog.id}`)
      .set('Authorization', authHeader)
      .send(updatedDataName)
      .expect(400)

    //case2
    const updatedDataNameMaxLength: CreateBlogModel = {
      name: 'updatedDataNameMaxLengthupdatedDataNameMaxLengthupdatedDataNameMaxLengthupdatedDataNameMaxLength',
      description: 'string',
      websiteUrl: 'https://google.com',
    }

    await getRequest()
      .put(`${'blogs'}/${createdBlog.id}`)
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

    await getRequest()
      .put(`${'blogs'}/${createdBlog.id}`)
      .set('Authorization', authHeader)
      .send(updatedDataDescription)
      .expect(400)

    await getRequest().get(`${'blogs'}/${createdBlog.id}`).expect(200)

    //case2
    const updatedDataDescriptionMaxLength: CreateBlogModel = {
      name: 'string',
      description:
        'updatedDataDescriptionMaxLengthupdatedDataDescriptionMaxLengthupdatedDataDescriptionMaxLengthupdatedDataDescriptionMaxLengthupdatedDataDescriptionMaxLengthupdatedDataDescriptionMaxLengthupdatedDataDescriptionMaxLengthupdatedDataDescriptionMaxLengthupdatedDataDescriptionMaxLengthupdatedDataDescriptionMaxLengthupdatedDataDescriptionMaxLengthupdatedDataDescriptionMaxLengthupdatedDataDescriptionMaxLengthupdatedDataDescriptionMaxLengthupdatedDataDescriptionMaxLengthupdatedDataDescriptionMaxLengthupdatedDataDescriptionMaxLengthupdatedDataDescriptionMaxLengthupdatedDataDescriptionMaxLengthupdatedDataDescriptionMaxLengthupdatedDataDescriptionMaxLengthupdatedDataDescriptionMaxLengthupdatedDataDescriptionMaxLengthupdatedDataDescriptionMaxLengthupdatedDataDescriptionMaxLengthupdatedDataDescriptionMaxLengthupdatedDataDescriptionMaxLength',
      websiteUrl: 'https://google.com',
    }

    await getRequest()
      .put(`${'blogs'}/${createdBlog.id}`)
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

    await getRequest()
      .put(`${'blogs'}/${createdBlog.id}`)
      .set('Authorization', authHeader)
      .send(updatedDataWebsiteUrl)
      .expect(400)

    await getRequest().get(`${'blogs'}/${createdBlog.id}`).expect(200)

    //case2
    const updatedDataWebsiteUrlMaxLength: CreateBlogModel = {
      name: 'string',
      description: 'string',
      websiteUrl:
        'https://googlegooglegooglegooglegooglegooglegooglegooglegooglegooglegooglegooglegooglegooglegooglegooglegooglegooglegooglegooglegooglegooglegooglegoogle.com',
    }

    await getRequest()
      .put(`${'blogs'}/${createdBlog.id}`)
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

    await getRequest()
      .put(`${'blogs'}/${createdBlog.id}`)
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

    const createdBlogById = await getRequest()
      .post(`blogs/${createdBlog.id}/posts`)
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
    })
  })

  it(`return all posts for specific blog`, async () => {
    //return all posts for specific blog
    const params2 = {
      pageNumber: 1,
      pageSize: 4,
      sortBy: 'createdAt',
      sortDirection: 'asc',
    }

    const postsByBlogId = await getRequest()
      .get(`blogs/${createdBlog.id}/posts`)
      .query(params2)
      .expect(200)

    const resPostsByBlogIdBody = postsByBlogId.body

    const firstPost = resPostsByBlogIdBody.items[0]
    expect(resPostsByBlogIdBody).toEqual({
      pagesCount: 1,
      page: 1,
      pageSize: resPostsByBlogIdBody.pageSize,
      totalCount: 1,
      items: [
        {
          id: firstPost.id,
          title: firstPost.title,
          shortDescription: firstPost.shortDescription,
          content: firstPost.content,
          blogId: firstPost.blogId,
          blogName: firstPost.blogName,
          createdAt: firstPost.createdAt,
        },
      ],
    })
  })

  it(`shouldn't delete blog by id with not existing id`, async () => {
    //case invalid id
    const validData: CreateBlogModel = {
      name: 'string',
      description: 'string',
      websiteUrl: 'https://google.com',
    }

    await getRequest()
      .delete(`${'blogs'}/33`)
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

    await getRequest()
      .delete(`${'blogs'}/${createdBlog.id}`)
      .set('Authorization', authHeader)
      .send(validData)
      .expect(204)
  })

  afterAll((done) => {
    done()
  })
})
