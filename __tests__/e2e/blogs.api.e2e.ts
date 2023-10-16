import request from 'supertest'

import { CreateBlogModel } from '../../src/models'

const getRequest = () => {
  return request('http://localhost:5000/')
}

function encodeCredentials(username: string, password: string) {
  const credentials = `${username}:${password}`
  const encodedCredentials = Buffer.from(credentials).toString('base64')
  return `Basic ${encodedCredentials}`
}

const EmptyOutput = {
  pagesCount: 0,
  page: 1,
  pageSize: 10,
  totalCount: 0,
  items: [],
}

describe('blogs', () => {
  beforeAll(async () => {
    await getRequest().delete(`${'testing'}/all-data`)
  })

  it('should return 200 and empty array', async () => {
    await getRequest().get(`blogs`).expect(200, EmptyOutput)
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
      .post('blogs')
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

    await getRequest().get(`${'blogs'}/${createdBlog.id}`).expect(200)

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

    await getRequest().get(`${'blogs'}/${createdBlog.id}`).expect(200)

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

    await getRequest().get(`${'blogs'}/${createdBlog.id}`).expect(200)

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

    await getRequest().get(`${'blogs'}/${createdBlog.id}`).expect(200)

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

    await getRequest().get(`${'blogs'}/${createdBlog.id}`).expect(200)

    //delete blog by id
    await getRequest()
      .delete(`${'blogs'}/${createdBlog.id}`)
      .set('Authorization', authHeader)
      .send(validData)
      .expect(204)

    //case invalid id
    await getRequest()
      .delete(`${'blogs'}/33`)
      .set('Authorization', authHeader)
      .send(validData)
      .expect(404)
  })

  it(
    'should create blog +' +
      'create post for specific blog +' +
      'return blogs with paging +' +
      'return all posts for specific blog',
    async () => {
      const username = 'admin'
      const password = 'qwerty'
      const authHeader = encodeCredentials(username, password)

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

      const createdBlog = createBlogRequest.body

      expect(createdBlog).toEqual({
        id: createdBlog.id,
        name: blogData.name,
        description: blogData.description,
        websiteUrl: blogData.websiteUrl,
        createdAt: createdBlog.createdAt,
        isMembership: createdBlog.isMembership,
      })

      //   //create post for specific blog
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

      //return blogs with paging
      const params = {
        searchNameTerm: 'str',
        sortBy: 'createdAt',
        sortDirection: 'asc',
        pageNumber: 1,
        pageSize: 4,
      }

      const blogsWithPaging = await getRequest()
        .get(`blogs`)
        .query(params)
        .expect(200)

      const resBlogsWithPagingBody = blogsWithPaging.body

      expect(resBlogsWithPagingBody).toEqual({
        pagesCount: 1,
        page: 1,
        pageSize: resBlogsWithPagingBody.pageSize,
        totalCount: 1,
        items: [
          {
            id: resBlogsWithPagingBody.items.map((i: any) => i.id)[0],
            name: resBlogsWithPagingBody.items.map((i: any) => i.name)[0],
            description: resBlogsWithPagingBody.items.map(
              (i: any) => i.description,
            )[0],
            websiteUrl: resBlogsWithPagingBody.items.map(
              (i: any) => i.websiteUrl,
            )[0],
            createdAt: resBlogsWithPagingBody.items.map(
              (i: any) => i.createdAt,
            )[0],
            isMembership: resBlogsWithPagingBody.items.map(
              (i: any) => i.isMembership,
            )[0],
          },
        ],
      })

      //   //return all posts for specific blog
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

      expect(resPostsByBlogIdBody).toEqual({
        pagesCount: 1,
        page: 1,
        pageSize: resPostsByBlogIdBody.pageSize,
        totalCount: 1,
        items: [
          {
            id: resPostsByBlogIdBody.items.map((i: any) => i.id)[0],
            title: resPostsByBlogIdBody.items.map((i: any) => i.title)[0],
            shortDescription: resPostsByBlogIdBody.items.map(
              (i: any) => i.shortDescription,
            )[0],
            content: resPostsByBlogIdBody.items.map((i: any) => i.content)[0],
            blogId: resPostsByBlogIdBody.items.map((i: any) => i.blogId)[0],
            blogName: resPostsByBlogIdBody.items.map((i: any) => i.blogName)[0],
            createdAt: resPostsByBlogIdBody.items.map(
              (i: any) => i.createdAt,
            )[0],
          },
        ],
      })
    },
  )

  afterAll((done) => {
    done()
  })
})
