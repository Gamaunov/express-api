import request from 'supertest'

import { CreateUserModel } from '../../src/models'
import { loginAttemptsRepository } from '../../src/infrastructure/loginAttempts-repository'
import { LoginOrEmailType } from '../../src/shared'

const getRequest = () => {
  return request('http://localhost:5000/')
}

function encodeCredentials(username: string, password: string) {
  const credentials = `${username}:${password}`
  const encodedCredentials = Buffer.from(credentials).toString('base64')
  return `Basic ${encodedCredentials}`
}

describe('auth', () => {
  beforeAll(async () => {
    await getRequest().delete(`${'testing'}/all-data`)
  })

  const username = 'admin'
  const password = 'qwerty'
  const authHeader = encodeCredentials(username, password)

  let superUser: any

  let superUserToken1: any
  let superUserToken2: any
  let superUserToken3: any
  let superUserToken4: any

  let superUserRToken1: any
  let superUserRToken2: any
  let superUserRToken3: any
  let superUserRToken4: any

  let newSuperUserToken1: any
  let newSuperUserToken2: any
  let newSuperUserToken3: any
  let newSuperUserToken4: any

  let createdBlog: any = null
  let createdPost: any = null
  let commentId: any = null

  const dataSUser: CreateUserModel = {
    login: 'login12345',
    password: 'password123',
    email: 'gamaunov1911@gmail.com',
  }

  const loginData: LoginOrEmailType = {
    loginOrEmail: 'login12345',
    password: 'password123',
  }

  const userAgent1 =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36'
  const userAgent2 =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:94.0) Gecko/20100101 Firefox/94.0'
  const userAgent3 =
    'Mozilla/5.0 (Linux; Android 10; SM-G960F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.86 Mobile App Android'
  const userAgent4 =
    'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
  const userAgent5 =
    'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'

  beforeEach(async () => {
    //should create super user with field - isConfirmed: true
    const superUserReq = await getRequest()
      .post(`users`)
      .set('Authorization', authHeader)
      .send(dataSUser)
      .expect(201)

    superUser = superUserReq.body
  })

  it(`should return 429 if more than 5 attempts from one IP-address during 10 seconds`, async () => {
    const customIpAddress = '7'

    await getRequest()
      .post(`auth/login`)
      .set('User-Agent', userAgent5)
      .set('x-real-ip', customIpAddress)
      .send(loginData)
      .expect(200)

    await getRequest()
      .post(`auth/login`)
      .set('User-Agent', userAgent5)
      .set('x-real-ip', customIpAddress)
      .send(loginData)
      .expect(200)

    await getRequest()
      .post(`auth/login`)
      .set('User-Agent', userAgent5)
      .set('x-real-ip', customIpAddress)
      .send(loginData)
      .expect(200)

    await getRequest()
      .post(`auth/login`)
      .set('User-Agent', userAgent5)
      .set('x-real-ip', customIpAddress)
      .send(loginData)
      .expect(200)

    await getRequest()
      .post(`auth/login`)
      .set('User-Agent', userAgent5)
      .set('x-real-ip', customIpAddress)
      .send(loginData)
      .expect(200)

    await getRequest()
      .post(`auth/login`)
      .set('User-Agent', userAgent5)
      .set('x-real-ip', customIpAddress)
      .send(loginData)
      .expect(429)

    await loginAttemptsRepository.deleteAllAttempts()
  })

  it(`should login user 4 times with different User-Agent`, async () => {
    //should login super user 4 times
    const loginSuperUser1 = await getRequest()
      .post(`auth/login`)
      .set('User-Agent', userAgent1)
      .send(loginData)
      .expect(200)

    superUserToken1 = loginSuperUser1.body.accessToken

    const loginSuperUser2 = await getRequest()
      .post(`auth/login`)
      .set('User-Agent', userAgent2)
      .send(loginData)
      .expect(200)

    superUserToken2 = loginSuperUser2.body.accessToken

    const loginSuperUser3 = await getRequest()
      .post(`auth/login`)
      .set('User-Agent', userAgent3)
      .send(loginData)
      .expect(200)

    superUserToken3 = loginSuperUser3.body.accessToken

    const loginSuperUser4 = await getRequest()
      .post(`auth/login`)
      .set('User-Agent', userAgent4)
      .send(loginData)
      .expect(200)

    superUserToken4 = loginSuperUser4.body.accessToken

    superUserRToken4 = loginSuperUser4.headers['set-cookie'].find(
      (cookie: string) => cookie.startsWith('refreshToken='),
    )
    // superUserRToken4 = refreshTokenCookie.split(';')[0].split('=')[1]
  })

  it(`should return new refreshToken for loginSuperUser4`, async () => {
    const loginSuperUser4 = await getRequest()
      .post(`auth/refresh-token`)
      .set('User-Agent', userAgent4)
      .set('Cookie', `${superUserRToken4}`)
      .expect(200)

    newSuperUserToken1 = loginSuperUser4.body.accessToken

    superUserRToken4 = loginSuperUser4.headers['set-cookie'].find(
      (cookie: string) => cookie.startsWith('refreshToken='),
    )
  })

  it(`should return list of active devices`, async () => {
    const loginSuperUser4 = await getRequest()
      .get(`security/devices`)
      .set('User-Agent', userAgent4)
      .set('Cookie', `${superUserRToken4}`)
      .expect(200)
  })

  afterAll((done) => {
    done()
  })
})
