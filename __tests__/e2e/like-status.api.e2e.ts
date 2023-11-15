import dotenv from 'dotenv'
import mongoose from 'mongoose'
import request from 'supertest'

import { app } from '../../src/app'
import { BlogsService } from '../../src/application/blogs.service'
import { PostsService } from '../../src/application/post.service'
import { container } from '../../src/composition-root'
import {
  CreateBlogModel,
  CreatePostModel,
  CreateUserModel,
} from '../../src/models'
import {
  EmptyOutput,
  authHeader,
  dislikeData,
  likeData,
  noneData,
} from '../helpers.test'

dotenv.config()

const mongoURI: string = process.env.MONGO_URI || `mongodb://0.0.0.0:27017/test`

if (!mongoURI) throw new Error('mongoURI not found')

const postsService = container.resolve(PostsService)
const blogsService = container.resolve(BlogsService)

describe('like-status', () => {
  beforeAll(async () => {
    await mongoose.connect(mongoURI)
    await request(app).delete('/testing/all-data')
  })

  afterAll(async () => {
    await mongoose.connection.close()
  })

  describe('like-status', () => {
    beforeAll(async () => {
      await request(app).delete(`${'/testing'}/all-data`)
    })

    let createdUser1: any = null
    let createdUser2: any = null
    let createdUser3: any = null
    let createdUser4: any = null
    let userToken1: any = null
    let userToken2: any = null
    let userToken3: any = null
    let userToken4: any = null

    let blog: any

    let post1: any
    let post2: any
    let post3: any
    let post4: any
    let post5: any
    let post6: any

    it(`POST -> "/users", "/auth/login": 
      should create and login 4 users; status 201; 
      content: created users;`, async () => {
      //user1
      const userData1: CreateUserModel = {
        login: 'userlogin1',
        password: 'userpassword1',
        email: '1qvccgaov11@gmail.com',
      }

      const createdUser1Data = await request(app)
        .post('/users')
        .set('Authorization', authHeader)
        .send(userData1)
        .expect(201)

      createdUser1 = createdUser1Data.body

      expect(createdUser1).toEqual({
        id: expect.any(String),
        email: userData1.email,
        login: userData1.login,
        createdAt: expect.any(String),
      })

      //user2
      const userData2: CreateUserModel = {
        login: 'userlogin2',
        password: 'userpassword2',
        email: '2qvccgaov11@gmail.com',
      }

      const createdUser2Data = await request(app)
        .post('/users')
        .set('Authorization', authHeader)
        .send(userData2)
        .expect(201)

      createdUser2 = createdUser2Data.body

      expect(createdUser2).toEqual({
        id: expect.any(String),
        email: userData2.email,
        login: userData2.login,
        createdAt: expect.any(String),
      })

      //user3
      const userData3: CreateUserModel = {
        login: 'userlogin3',
        password: 'userpassword3',
        email: '3qvccgaov11@gmail.com',
      }

      const createdUser3Data = await request(app)
        .post('/users')
        .set('Authorization', authHeader)
        .send(userData3)
        .expect(201)

      createdUser3 = createdUser3Data.body

      expect(createdUser3).toEqual({
        id: expect.any(String),
        email: userData3.email,
        login: userData3.login,
        createdAt: expect.any(String),
      })

      //user4
      const userData4: CreateUserModel = {
        login: 'userlogin4',
        password: 'userpassword4',
        email: '4qvccgaov11@gmail.com',
      }

      const createdUser4Data = await request(app)
        .post('/users')
        .set('Authorization', authHeader)
        .send(userData4)
        .expect(201)

      createdUser4 = createdUser4Data.body

      expect(createdUser4).toEqual({
        id: expect.any(String),
        email: userData4.email,
        login: userData4.login,
        createdAt: expect.any(String),
      })

      //login user1
      const loginUser1 = {
        loginOrEmail: 'userlogin1',
        password: 'userpassword1',
      }

      const loggedUser1 = await request(app)
        .post('/auth/login')
        .send(loginUser1)
        .expect(200)

      userToken1 = loggedUser1.body.accessToken

      //login user2
      const loginUser2 = {
        loginOrEmail: 'userlogin2',
        password: 'userpassword2',
      }

      const loggedUser2 = await request(app)
        .post('/auth/login')
        .send(loginUser2)
        .expect(200)

      userToken2 = loggedUser2.body.accessToken

      //login user3
      const loginUser3 = {
        loginOrEmail: 'userlogin3',
        password: 'userpassword3',
      }

      const loggedUser3 = await request(app)
        .post('/auth/login')
        .send(loginUser3)
        .expect(200)

      userToken3 = loggedUser3.body.accessToken

      //login user4
      const loginUser4 = {
        loginOrEmail: 'userlogin4',
        password: 'userpassword4',
      }

      const loggedUser4 = await request(app)
        .post('/auth/login')
        .send(loginUser4)
        .expect(200)

      userToken4 = loggedUser4.body.accessToken
    })

    it(`PUT -> "/posts/:postId/like-status": 
      create post then: like the post by user 1, user 2, 
      user 3, user 4. get the post after each like by user 1. 
      NewestLikes should be sorted in descending; status 204; 
      used additional methods: POST => /blogs, POST => /posts, GET => /posts/:id;`, async () => {
      let blog
      let post

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

      blog = createBlogRequest.body

      expect(blog).toEqual({
        id: expect.any(String),
        name: blogData.name,
        description: blogData.description,
        websiteUrl: blogData.websiteUrl,
        createdAt: expect.any(String),
        isMembership: false,
      })

      //creating post
      const data: CreatePostModel = {
        title: 'string',
        shortDescription: 'string',
        content: 'string',
        blogId: blog.id,
      }

      const createRequest = await request(app)
        .post('/posts')
        .set('Authorization', authHeader)
        .send(data)
        .expect(201)

      post = createRequest.body

      expect(post).toEqual({
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

      //like the post by user 1, user 2, user 3, user 4
      await request(app)
        .put(`/posts/${post.id}/like-status`)
        .set('Authorization', `Bearer ${userToken1}`)
        .send(likeData)
        .expect(204)

      await request(app)
        .put(`/posts/${post.id}/like-status`)
        .set('Authorization', `Bearer ${userToken2}`)
        .send(likeData)
        .expect(204)

      await request(app)
        .put(`/posts/${post.id}/like-status`)
        .set('Authorization', `Bearer ${userToken3}`)
        .send(likeData)
        .expect(204)

      await request(app)
        .put(`/posts/${post.id}/like-status`)
        .set('Authorization', `Bearer ${userToken4}`)
        .send(likeData)
        .expect(204)

      // get the post after each like by user 1.
      // NewestLikes should be sorted in descending
      const updatedPost = await request(app)
        .get(`/posts/${post.id}`)
        .set('Authorization', `Bearer ${userToken1}`)
        .expect(200)

      const responseBody = updatedPost.body

      expect(responseBody).toEqual({
        id: responseBody.id,
        title: responseBody.title,
        shortDescription: responseBody.shortDescription,
        content: responseBody.content,
        blogId: responseBody.blogId,
        blogName: responseBody.blogName,
        createdAt: responseBody.createdAt,
        extendedLikesInfo: {
          likesCount: 4,
          dislikesCount: 0,
          myStatus: 'Like',
          newestLikes: [
            {
              addedAt: expect.any(String),
              login: createdUser4.login,
              userId: createdUser4.id,
            },
            {
              addedAt: expect.any(String),
              login: createdUser3.login,
              userId: createdUser3.id,
            },
            {
              addedAt: expect.any(String),
              login: createdUser2.login,
              userId: createdUser2.id,
            },
          ],
        },
      })
    })

    it(`PUT -> "/posts/:postId/like-status": 
      create post then: dislike the post by user 1, user 2; like the post by user 3; 
      get the post after each like by user 1; status 204; 
      used additional methods: POST => /blogs, POST => /posts, GET => /posts/:id;`, async () => {
      let blog
      let post

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

      blog = createBlogRequest.body

      expect(blog).toEqual({
        id: expect.any(String),
        name: blogData.name,
        description: blogData.description,
        websiteUrl: blogData.websiteUrl,
        createdAt: expect.any(String),
        isMembership: false,
      })

      //creating post
      const data: CreatePostModel = {
        title: 'string',
        shortDescription: 'string',
        content: 'string',
        blogId: blog.id,
      }

      const createRequest = await request(app)
        .post('/posts')
        .set('Authorization', authHeader)
        .send(data)
        .expect(201)

      post = createRequest.body

      expect(post).toEqual({
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

      //dislike the post by user 1, user 2; like the post by user 3;
      await request(app)
        .put(`/posts/${post.id}/like-status`)
        .set('Authorization', `Bearer ${userToken1}`)
        .send(dislikeData)
        .expect(204)

      await request(app)
        .put(`/posts/${post.id}/like-status`)
        .set('Authorization', `Bearer ${userToken2}`)
        .send(dislikeData)
        .expect(204)

      await request(app)
        .put(`/posts/${post.id}/like-status`)
        .set('Authorization', `Bearer ${userToken3}`)
        .send(likeData)
        .expect(204)

      // get the post after each like by user 1
      const updatedPost = await request(app)
        .get(`/posts/${post.id}`)
        .set('Authorization', `Bearer ${userToken1}`)
        .expect(200)

      const responseBody = updatedPost.body

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
          dislikesCount: 2,
          myStatus: 'Dislike',
          newestLikes: [
            {
              addedAt: expect.any(String),
              login: createdUser3.login,
              userId: createdUser3.id,
            },
          ],
        },
      })
    })

    it(`PUT -> "/posts/:postId/like-status": 
      create post then: like the post twice by user 1; get the post after each like by user 1. 
      Should increase like's count once; status 204; 
      used additional methods: POST => /blogs, POST => /posts, GET => /posts/:id;`, async () => {
      let blog
      let post

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

      blog = createBlogRequest.body

      expect(blog).toEqual({
        id: expect.any(String),
        name: blogData.name,
        description: blogData.description,
        websiteUrl: blogData.websiteUrl,
        createdAt: expect.any(String),
        isMembership: false,
      })

      //creating post
      const data: CreatePostModel = {
        title: 'string',
        shortDescription: 'string',
        content: 'string',
        blogId: blog.id,
      }

      const createRequest = await request(app)
        .post('/posts')
        .set('Authorization', authHeader)
        .send(data)
        .expect(201)

      post = createRequest.body

      expect(post).toEqual({
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

      // like the post twice by user 1
      await request(app)
        .put(`/posts/${post.id}/like-status`)
        .set('Authorization', `Bearer ${userToken1}`)
        .send(likeData)
        .expect(204)

      await request(app)
        .put(`/posts/${post.id}/like-status`)
        .set('Authorization', `Bearer ${userToken1}`)
        .send(likeData)
        .expect(204)

      // get the post after each like by user 1.
      // Should increase like's count once; status 204;
      const updatedPost = await request(app)
        .get(`/posts/${post.id}`)
        .set('Authorization', `Bearer ${userToken1}`)
        .expect(200)

      const responseBody = updatedPost.body

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
          myStatus: 'Like',
          newestLikes: [
            {
              addedAt: expect.any(String),
              login: createdUser1.login,
              userId: createdUser1.id,
            },
          ],
        },
      })
    })
    it(`PUT -> "/posts/:postId/like-status": 
          create post then: like the post by user 1; dislike the post by user 1; set 'none' status by user 1; 
          get the post after each like by user 1; status 204; 
          used additional methods: POST => /blogs, POST => /posts, GET => /posts/:id;`, async () => {
      let blog
      let post

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

      blog = createBlogRequest.body

      expect(blog).toEqual({
        id: expect.any(String),
        name: blogData.name,
        description: blogData.description,
        websiteUrl: blogData.websiteUrl,
        createdAt: expect.any(String),
        isMembership: false,
      })

      //creating post
      const data: CreatePostModel = {
        title: 'string',
        shortDescription: 'string',
        content: 'string',
        blogId: blog.id,
      }

      const createRequest = await request(app)
        .post('/posts')
        .set('Authorization', authHeader)
        .send(data)
        .expect(201)

      post = createRequest.body

      expect(post).toEqual({
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

      //like the post by user 1; dislike the post by user 1; set 'none' status by user 1
      await request(app)
        .put(`/posts/${post.id}/like-status`)
        .set('Authorization', `Bearer ${userToken1}`)
        .send(likeData)
        .expect(204)

      await request(app)
        .put(`/posts/${post.id}/like-status`)
        .set('Authorization', `Bearer ${userToken1}`)
        .send(dislikeData)
        .expect(204)

      await request(app)
        .put(`/posts/${post.id}/like-status`)
        .set('Authorization', `Bearer ${userToken1}`)
        .send(noneData)
        .expect(204)

      // get the post after each like by user 1;
      const updatedPost = await request(app)
        .get(`/posts/${post.id}`)
        .set('Authorization', `Bearer ${userToken1}`)
        .expect(200)

      const responseBody = updatedPost.body

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
    it(`PUT -> "/posts/:postId/like-status": create post 
      then: like the post by user 1 
      then get by user 2; dislike the post by user 2 
      then get by the user 1; status 204; 
      used additional methods: POST => /blogs, POST => /posts, GET => /posts/:id;`, async () => {
      let blog
      let post

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

      blog = createBlogRequest.body

      expect(blog).toEqual({
        id: expect.any(String),
        name: blogData.name,
        description: blogData.description,
        websiteUrl: blogData.websiteUrl,
        createdAt: expect.any(String),
        isMembership: false,
      })

      //creating post
      const data: CreatePostModel = {
        title: 'string',
        shortDescription: 'string',
        content: 'string',
        blogId: blog.id,
      }

      const createRequest = await request(app)
        .post('/posts')
        .set('Authorization', authHeader)
        .send(data)
        .expect(201)

      post = createRequest.body

      expect(post).toEqual({
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

      // like the post by user 1
      await request(app)
        .put(`/posts/${post.id}/like-status`)
        .set('Authorization', `Bearer ${userToken1}`)
        .send(likeData)
        .expect(204)

      //get by user 2
      const updatedPost = await request(app)
        .get(`/posts/${post.id}`)
        .set('Authorization', `Bearer ${userToken2}`)
        .expect(200)

      const responseBody = updatedPost.body

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
              login: createdUser1.login,
              userId: createdUser1.id,
            },
          ],
        },
      })

      //dislike the post by user 2
      await request(app)
        .put(`/posts/${post.id}/like-status`)
        .set('Authorization', `Bearer ${userToken2}`)
        .send(dislikeData)
        .expect(204)

      //get by the user 1
      const updatedPost2 = await request(app)
        .get(`/posts/${post.id}`)
        .set('Authorization', `Bearer ${userToken1}`)
        .expect(200)

      const responseBody2 = updatedPost2.body

      expect(responseBody2).toEqual({
        id: responseBody2.id,
        title: responseBody2.title,
        shortDescription: responseBody2.shortDescription,
        content: responseBody2.content,
        blogId: responseBody2.blogId,
        blogName: responseBody2.blogName,
        createdAt: responseBody2.createdAt,
        extendedLikesInfo: {
          likesCount: 1,
          dislikesCount: 1,
          myStatus: 'Like',
          newestLikes: [
            {
              addedAt: expect.any(String),
              login: createdUser1.login,
              userId: createdUser1.id,
            },
          ],
        },
      })
    })

    it(`should delete all posts, blogs`, async () => {
      await postsService.deleteAllPosts()
      await blogsService.deleteAllBlogs()

      await request(app).get('/posts').expect(200, EmptyOutput)
      await request(app).get('/blogs').expect(200, EmptyOutput)
    })

    it(`GET -> "/posts": 
      create 6 posts then: like post 1 by user 1, user 2; like post 2 by user 2, user 3; 
      dislike post 3 by user 1; like post 4 by user 1, user 4, user 2, user 3; 
      like post 5 by user 2, dislike by user 3; like post 6 by user 1, dislike by user 2. 
      Get the posts by user 1 after all likes 
      NewestLikes should be sorted in descending; 
      status 200; content: posts array with pagination; 
      used additional methods: POST -> /blogs, POST -> /posts, PUT -> posts/:postId/like-status;`, async () => {
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

      blog = createBlogRequest.body

      expect(blog).toEqual({
        id: expect.any(String),
        name: blogData.name,
        description: blogData.description,
        websiteUrl: blogData.websiteUrl,
        createdAt: expect.any(String),
        isMembership: false,
      })

      //create 6 posts
      const data: CreatePostModel = {
        title: 'string',
        shortDescription: 'string',
        content: 'string',
        blogId: blog.id,
      }

      //post1
      const createRequest = await request(app)
        .post('/posts')
        .set('Authorization', authHeader)
        .send(data)
        .expect(201)

      post1 = createRequest.body

      expect(post1).toEqual({
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

      //post2
      const createRequest2 = await request(app)
        .post('/posts')
        .set('Authorization', authHeader)
        .send(data)
        .expect(201)

      post2 = createRequest2.body

      expect(post2).toEqual({
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

      //post3
      const createRequest3 = await request(app)
        .post('/posts')
        .set('Authorization', authHeader)
        .send(data)
        .expect(201)

      post3 = createRequest3.body

      expect(post3).toEqual({
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

      //post4
      const createRequest4 = await request(app)
        .post('/posts')
        .set('Authorization', authHeader)
        .send(data)
        .expect(201)

      post4 = createRequest4.body

      expect(post4).toEqual({
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

      //post5
      const createRequest5 = await request(app)
        .post('/posts')
        .set('Authorization', authHeader)
        .send(data)
        .expect(201)

      post5 = createRequest5.body

      expect(post5).toEqual({
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

      //post6
      const createRequest6 = await request(app)
        .post('/posts')
        .set('Authorization', authHeader)
        .send(data)
        .expect(201)

      post6 = createRequest6.body

      expect(post6).toEqual({
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

      // like post 1 by user 1, user 2;
      await request(app)
        .put(`/posts/${post1.id}/like-status`)
        .set('Authorization', `Bearer ${userToken1}`)
        .send(likeData)
        .expect(204)

      await request(app)
        .put(`/posts/${post1.id}/like-status`)
        .set('Authorization', `Bearer ${userToken2}`)
        .send(likeData)
        .expect(204)

      // like post 2 by user 2, user 3;
      await request(app)
        .put(`/posts/${post2.id}/like-status`)
        .set('Authorization', `Bearer ${userToken2}`)
        .send(likeData)
        .expect(204)

      await request(app)
        .put(`/posts/${post2.id}/like-status`)
        .set('Authorization', `Bearer ${userToken3}`)
        .send(likeData)
        .expect(204)

      //dislike post 3 by user 1;
      await request(app)
        .put(`/posts/${post3.id}/like-status`)
        .set('Authorization', `Bearer ${userToken1}`)
        .send(dislikeData)
        .expect(204)

      //like post 4 by user 1, user 4, user 2, user 3;
      await request(app)
        .put(`/posts/${post4.id}/like-status`)
        .set('Authorization', `Bearer ${userToken1}`)
        .send(likeData)
        .expect(204)

      await request(app)
        .put(`/posts/${post4.id}/like-status`)
        .set('Authorization', `Bearer ${userToken4}`)
        .send(likeData)
        .expect(204)

      await request(app)
        .put(`/posts/${post4.id}/like-status`)
        .set('Authorization', `Bearer ${userToken2}`)
        .send(likeData)
        .expect(204)

      await request(app)
        .put(`/posts/${post4.id}/like-status`)
        .set('Authorization', `Bearer ${userToken3}`)
        .send(likeData)
        .expect(204)

      //like post 5 by user 2, dislike by user 3;
      await request(app)
        .put(`/posts/${post5.id}/like-status`)
        .set('Authorization', `Bearer ${userToken2}`)
        .send(likeData)
        .expect(204)

      await request(app)
        .put(`/posts/${post5.id}/like-status`)
        .set('Authorization', `Bearer ${userToken3}`)
        .send(dislikeData)
        .expect(204)

      // like post 6 by user 1, dislike by user 2
      await request(app)
        .put(`/posts/${post6.id}/like-status`)
        .set('Authorization', `Bearer ${userToken1}`)
        .send(likeData)
        .expect(204)

      await request(app)
        .put(`/posts/${post6.id}/like-status`)
        .set('Authorization', `Bearer ${userToken2}`)
        .send(dislikeData)
        .expect(204)

      // Get the posts by user 1 after all likes
      // NewestLikes should be sorted in descending;
      const queryData = {
        pageSize: 6,
        sortDirection: 'desc',
      }
      const updatedPost = await request(app)
        .get(`/posts`)
        .set('Authorization', `Bearer ${userToken1}`)
        .query(queryData)
        .expect(200)

      const responseBody = updatedPost.body

      expect(responseBody.items[0].id).toEqual(post6.id)
      expect(responseBody.items[1].id).toEqual(post5.id)
      expect(responseBody.items[2].id).toEqual(post4.id)
      expect(responseBody.items[3].id).toEqual(post3.id)
      expect(responseBody.items[4].id).toEqual(post2.id)
      expect(responseBody.items[5].id).toEqual(post1.id)

      expect(
        responseBody.items[2].extendedLikesInfo.newestLikes[0].login,
      ).toEqual(createdUser3.login)
      expect(
        responseBody.items[2].extendedLikesInfo.newestLikes[1].login,
      ).toEqual(createdUser2.login)
      expect(
        responseBody.items[2].extendedLikesInfo.newestLikes[2].login,
      ).toEqual(createdUser4.login)

      expect(
        responseBody.items[5].extendedLikesInfo.newestLikes[0].login,
      ).toEqual(createdUser2.login)
      expect(
        responseBody.items[5].extendedLikesInfo.newestLikes[1].login,
      ).toEqual(createdUser1.login)

      expect(
        responseBody.items[4].extendedLikesInfo.newestLikes[0].login,
      ).toEqual(createdUser3.login)
      expect(
        responseBody.items[4].extendedLikesInfo.newestLikes[1].login,
      ).toEqual(createdUser2.login)
    }, 20000)
  })
})
