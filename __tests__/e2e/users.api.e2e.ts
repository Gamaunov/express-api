import request from 'supertest'

import { CreateUserModel } from '../../src/features/users'
import { EmptyOutput } from './blogs.api.e2e'


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

  it('should return 200 and empty array', async () => {
    await getRequest().get('users').expect(200, EmptyOutput)
  })

  it(`shouldn't create user with incorrect input data`, async () => {
    const username = 'admin'
    const password = 'qwerty'

    const authHeader = encodeCredentials(username, password)

    //case empty login
    const data: CreateUserModel = {
      login: '',
      password: 'string123',
      email: 'qvccgaov11@gmail.com',
    }

    await getRequest()
      .post('users')
      .set('Authorization', authHeader)
      .send(data)
      .expect(400)

    //case empty password
    const invalidPasswordData: CreateUserModel = {
      login: 'login',
      password: '',
      email: 'qvccgaov11@gmail.com',
    }

    await getRequest()
      .post('users')
      .set('Authorization', authHeader)
      .send(invalidPasswordData)
      .expect(400)

    //case empty email
    const emptyEmail: CreateUserModel = {
      login: 'login',
      password: 'string123',
      email: '',
    }

    await getRequest()
      .post('users')
      .set('Authorization', authHeader)
      .send(emptyEmail)
      .expect(400)

    //case max length > 10 login
    const loginLength10: CreateUserModel = {
      login: 'loginloginloginloginloginloginloginlogin',
      password: 'string123',
      email: 'qvccgaov11@gmail.com',
    }

    await getRequest()
      .post('users')
      .set('Authorization', authHeader)
      .send(loginLength10)
      .expect(400)

    //case max length <3  login
    const loginLength3: CreateUserModel = {
      login: 'lo',
      password: 'string123',
      email: 'qvccgaov11@gmail.com',
    }

    await getRequest()
      .post('users')
      .set('Authorization', authHeader)
      .send(loginLength3)
      .expect(400)

    //case invalid pattern login
    const loginPattern: CreateUserModel = {
      login: '+++!!!',
      password: 'string123',
      email: 'qvccgaov11@gmail.com',
    }

    await getRequest()
      .post('users')
      .set('Authorization', authHeader)
      .send(loginPattern)
      .expect(400)

    //case invalid password max length <6
    const passwordLength6: CreateUserModel = {
      login: 'login',
      password: 'str',
      email: 'qvccgaov11@gmail.com',
    }

    await getRequest()
      .post('users')
      .set('Authorization', authHeader)
      .send(passwordLength6)
      .expect(400)

    //case invalid password max length >20
    const passwordLength20: CreateUserModel = {
      login: 'login',
      password:
        'passwordLength20passwordLength20passwordLength20passwordLength20',
      email: 'qvccgaov11@gmail.com',
    }

    await getRequest()
      .post('users')
      .set('Authorization', authHeader)
      .send(passwordLength20)
      .expect(400)

    //case invalid email pattern
    const emailPattern: CreateUserModel = {
      login: 'login',
      password: '123123',
      email: 'qvccgaov11@gmail',
    }

    await getRequest()
      .post('users')
      .set('Authorization', authHeader)
      .send(emailPattern)
      .expect(400)
  })

  let createdUser: any = null
  it(`should create user with correct input data +
  should find user by searchLoginTerm +
  should find user by searchEmailTerm`, async () => {
    const username = 'admin'
    const password = 'qwerty'

    const authHeader = encodeCredentials(username, password)

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

    //case find user by searchLoginTerm
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

    expect(userBySearchLoginTerm).toEqual({
      pagesCount: 1,
      page: 1,
      pageSize: userBySearchLoginTerm.pageSize,
      totalCount: 1,
      items: [
        {
          id: userBySearchLoginTerm.items.map((i: any) => i.id)[0],
          email: userBySearchLoginTerm.items.map((i: any) => i.email)[0],
          login: userBySearchLoginTerm.items.map((i: any) => i.login)[0],
          createdAt: userBySearchLoginTerm.items.map(
            (i: any) => i.createdAt,
          )[0],
        },
      ],
    })

    //case find user by searchEmailTerm
    const paramsForEmail = {
      sortBy: 'createdAt',
      sortDirection: 'asc',
      pageNumber: 1,
      pageSize: 4,
      searchEmailTerm: 'aov',
    }

    const usersWithPagingEmail = await getRequest()
      .get(`users`)
      .query(paramsForEmail)
      .expect(200)

    const userBySearchEmailTerm = usersWithPagingEmail.body

    expect(userBySearchEmailTerm).toEqual({
      pagesCount: 1,
      page: 1,
      pageSize: userBySearchEmailTerm.pageSize,
      totalCount: 1,
      items: [
        {
          id: userBySearchEmailTerm.items.map((i: any) => i.id)[0],
          email: userBySearchEmailTerm.items.map((i: any) => i.email)[0],
          login: userBySearchEmailTerm.items.map((i: any) => i.login)[0],
          createdAt: userBySearchEmailTerm.items.map(
            (i: any) => i.createdAt,
          )[0],
        },
      ],
    })
  })

  afterAll((done) => {
    done()
  })
})