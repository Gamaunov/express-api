import request from 'supertest'

import { CreateUserModel } from '../../src/models'

const getRequest = () => {
  return request('http://localhost:5000/')
}

function encodeCredentials(username: string, password: string) {
  const credentials = `${username}:${password}`
  const encodedCredentials = Buffer.from(credentials).toString('base64')
  return `Basic ${encodedCredentials}`
}

describe('users', () => {
  beforeAll(async () => {
    await getRequest().delete(`${'testing'}/all-data`)
  })

  const username = 'admin'
  const password = 'qwerty'
  const authHeader = encodeCredentials(username, password)
  let createdUser: any

  beforeEach(async () => {
    //case create user with correct input data
    const createUserData: CreateUserModel = {
      login: 'login',
      password: 'string123',
      email: 'qvccgaov11@gmail.com',
    }

    const createdUserData = await getRequest()
      .post('users')
      .set('Authorization', authHeader)
      .send(createUserData)
      .expect(201)

    createdUser = createdUserData.body

    expect(createdUser).toEqual({
      id: expect.any(String),
      email: createUserData.email,
      login: createUserData.login,
      createdAt: expect.any(String),
    })
  })

  it(`should find user by searchLoginTerm +
  should find user by searchEmailTerm`, async () => {
    const params = {
      sortBy: 'createdAt',
      sortDirection: 'asc',
      pageNumber: 1,
      pageSize: 4,
      searchLoginTerm: 'login',
    }

    const usersWithPaging = await getRequest()
      .get(`users`)
      .query(params)
      .expect(200)

    const userBySearchLoginTerm = usersWithPaging.body
    const user = userBySearchLoginTerm.items[0]

    expect(userBySearchLoginTerm).toEqual({
      pagesCount: 1,
      page: 1,
      pageSize: userBySearchLoginTerm.pageSize,
      totalCount: 1,
      items: [
        {
          id: user.id,
          email: user.email,
          login: user.login,
          createdAt: user.createdAt,
        },
      ],
    })

    //should find user by searchEmailTerm
    const paramsForEmail = {
      sortBy: 'createdAt',
      sortDirection: 'asc',
      pageNumber: 1,
      pageSize: 4,
      searchEmailTerm: 'qv',
    }

    const usersWithPagingEmail = await getRequest()
      .get(`users`)
      .query(paramsForEmail)
      .expect(200)

    const userBySearchEmailTerm = usersWithPagingEmail.body
    const user2 = userBySearchEmailTerm.items[0]

    expect(userBySearchEmailTerm).toEqual({
      pagesCount: 1,
      page: 1,
      pageSize: userBySearchEmailTerm.pageSize,
      totalCount: 1,
      items: [
        {
          id: user2.id,
          email: user2.email,
          login: user2.login,
          createdAt: user2.createdAt,
        },
      ],
    })
  })

  it(`should delete user by id`, async () => {
    await getRequest()
      .delete(`users/${createdUser.id}`)
      .set('Authorization', authHeader)
      .expect(204)
  })

  afterAll((done) => {
    done()
  })
})
