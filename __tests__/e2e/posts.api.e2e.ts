import request from 'supertest'

import { CreateBlogModel, CreatePostModel } from '../../src/models'

const EmptyOutput = {
  pagesCount: 0,
  page: 1,
  pageSize: 10,
  totalCount: 0,
  items: [],
}

const getRequest = () => {
  return request('http://localhost:5000/')
}

function encodeCredentials(username: string, password: string) {
  const credentials = `${username}:${password}`
  const encodedCredentials = Buffer.from(credentials).toString('base64')
  return `Basic ${encodedCredentials}`
}

describe('posts', () => {
  beforeAll(async () => {
    await getRequest().delete(`${'testing'}/all-data`)
  })

  it('should return 200 and empty array', async () => {
    await getRequest().get('posts').expect(200, EmptyOutput)
  })

  it(`should return 404 for not existing post`, async () => {
    await getRequest().get(`${'posts'}/5`).expect(404)
  })

  it(`shouldn't create post with incorrect input data`, async () => {
    //case empty title
    const data: CreatePostModel = {
      title: '',
      shortDescription: 'string',
      content: 'string',
      blogId: 'string',
    }

    const username = 'admin'
    const password = 'qwerty'

    const authHeader = encodeCredentials(username, password)

    await getRequest()
      .post('posts')
      .set('Authorization', authHeader)
      .send(data)
      .expect(400)

    await getRequest().get('posts').expect(200)

    //case invalid title max length > 30
    const invalidTitleData: CreatePostModel = {
      title:
        'invalidTitleDtainvalidTitleDtainvalidTitleDtainvalidTitleDtainvalidTitleDtainvalidTitleDtainvalidTitleDta',
      shortDescription: 'string',
      content: 'string',
      blogId: 'string',
    }

    await getRequest()
      .post('posts')
      .set('Authorization', authHeader)
      .send(invalidTitleData)
      .expect(400)

    await getRequest().get('posts').expect(200)

    //case empty shortDescription
    const emptyShortDescription: CreatePostModel = {
      title: 'title',
      shortDescription: '',
      content: 'string',
      blogId: 'string',
    }

    await getRequest()
      .post('posts')
      .set('Authorization', authHeader)
      .send(emptyShortDescription)
      .expect(400)

    await getRequest().get('posts').expect(200)

    //case invalid shortDescription max length > 100
    const invalidShortDescription: CreatePostModel = {
      title: 'title',
      shortDescription:
        'case invalid shortDescription max lengthcase invalid shortDescription max lengthcase invalid shortDescription max lengthcase invalid shortDescription max lengthcase invalid shortDescription max lengthcase invalid shortDescription max lengthcase invalid shortDescription max lengthcase invalid shortDescription max lengthcase invalid shortDescription max lengthcase invalid shortDescription max length',
      content: 'string',
      blogId: 'string',
    }

    await getRequest()
      .post('posts')
      .set('Authorization', authHeader)
      .send(invalidShortDescription)
      .expect(400)

    await getRequest().get('posts').expect(200)

    //case empty content
    const emptyContent: CreatePostModel = {
      title: 'title',
      shortDescription: 'shortDescription',
      content: '',
      blogId: 'string',
    }

    await getRequest()
      .post('posts')
      .set('Authorization', authHeader)
      .send(emptyContent)
      .expect(400)

    await getRequest().get('posts').expect(200)

    //case invalid content max length > 1000
    const invalidContent: CreatePostModel = {
      title: 'title',
      shortDescription: 'shortDescription',
      content:
        'invalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContentinvalidContent',
      blogId: 'string',
    }

    await getRequest()
      .post('posts')
      .set('Authorization', authHeader)
      .send(invalidContent)
      .expect(400)

    await getRequest().get('posts').expect(200)

    //case invalid blogId
    const invalidBlogId: CreatePostModel = {
      title: 'title',
      shortDescription: 'shortDescription',
      content: 'content',
      blogId: '',
    }

    await getRequest()
      .post('posts')
      .set('Authorization', authHeader)
      .send(invalidBlogId)
      .expect(400)

    await getRequest().get('posts').expect(200)
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

    //update title
    const emptyTitle: CreatePostModel = {
      title: '',
      shortDescription: 'string',
      content: 'string',
      blogId: 'string',
    }

    await getRequest()
      .put(`${'posts'}/${createdPost.id}`)
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

    await getRequest()
      .put(`${'posts'}/${createdPost.id}`)
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

    await getRequest()
      .put(`${'posts'}/${createdPost.id}`)
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

    await getRequest()
      .put(`${'posts'}/${createdPost.id}`)
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

    await getRequest()
      .put(`${'posts'}/${createdPost.id}`)
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

    await getRequest()
      .put(`${'posts'}/${createdPost.id}`)
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

    await getRequest()
      .put(`${'posts'}/${createdPost.id}`)
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

    await getRequest()
      .put(`${'posts'}/${createdPost.id}`)
      .set('Authorization', authHeader)
      .send(invalidBlogId)
      .expect(400)

    //update posts with valida data
    await getRequest()
      .put(`${'posts'}/${createdPost.id}`)
      .set('Authorization', authHeader)
      .send(data)
      .expect(204)

    //delete post by id
    await getRequest()
      .delete(`${'posts'}/${createdPost.id}`)
      .set('Authorization', authHeader)
      .send(data)
      .expect(204)

    //case invalid id
    await getRequest()
      .delete(`${'posts'}/12`)
      .set('Authorization', authHeader)
      .send(data)
      .expect(404)
  })

  afterAll((done) => {
    done()
  })
})
