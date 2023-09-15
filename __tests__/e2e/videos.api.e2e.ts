import request from 'supertest'

import { app } from '../../src/app'
import { CreateVideoModel } from '../../src/features/videos/models/CreateVideoModel'
import { AvailableResolutions } from '../../src/shared/types/types'
import { HTTP_STATUSES } from '../../src/shared/utils/http-statuses'
import { RouterPath } from '../../src/shared/utils/router-path'

const getRequest = () => {
  return request(app)
}

describe('home video', () => {
  beforeAll(async () => {
    await getRequest().delete(`${RouterPath.__test__}/data`)
  })

  it('should return 200 and empty array', async () => {
    await getRequest().get(RouterPath.videos).expect(HTTP_STATUSES.OK_200, [])
  })

  it(`should return 404 for not existing video`, async () => {
    await getRequest()
      .get(`${RouterPath.videos}/123`)
      .expect(HTTP_STATUSES.NOT_FOUND_404)
  })

  it(`shouldn't create video with incorrect input data`, async () => {
    const data: CreateVideoModel = {
      title: '',
      author: 'author',
      availableResolutions: [AvailableResolutions.P144],
    }

    await getRequest()
      .post(RouterPath.videos)
      .send(data)
      .expect(HTTP_STATUSES.BAD_REQUEST_400)

    await getRequest().get(RouterPath.videos).expect(HTTP_STATUSES.OK_200)
  })

  it(`should return an empty array if the data is incorrect`, async () => {
    const emptyData = await getRequest()
      .post(`${RouterPath.videos}`)
      .send({})
      .expect(HTTP_STATUSES.BAD_REQUEST_400)

    expect(emptyData.body).toEqual({
      errorsMessages: [
        { message: expect.any(String), field: 'title' },
        { message: expect.any(String), field: 'author' },
      ],
    })

    const res = await getRequest().get(`${RouterPath.videos}`)
    expect(res.body).toEqual([])
  })

  it(`should return an empty array if field author is incorrect`, async () => {
    const incorrectAuthor = await getRequest()
      .post(`${RouterPath.videos}`)
      .send({
        title: 'w',
        author: 'mas_que_20_kwosjdjdodkddkdskdslslkskl',
      })
      .expect(HTTP_STATUSES.BAD_REQUEST_400)

    expect(incorrectAuthor.body).toEqual({
      errorsMessages: [{ message: expect.any(String), field: 'author' }],
    })

    const res = await getRequest().get(`${RouterPath.videos}`)
    expect(res.body).toEqual([])
  })

  it(`should return an empty array if field title is incorrect`, async () => {
    const incorrectTitle = await getRequest()
      .post(`${RouterPath.videos}`)
      .send({
        title: 'mas_que_40_kwosjdjdodkddkdskdslslksklfgjdfjdfgjdjgbcvbnsdf',
        author: 'author',
      })
      .expect(HTTP_STATUSES.BAD_REQUEST_400)

    expect(incorrectTitle.body).toEqual({
      errorsMessages: [{ message: expect.any(String), field: 'title' }],
    })

    const res = await getRequest().get(`${RouterPath.videos}`)
    expect(res.body).toEqual([])
  })

  it(`should return an empty array if field availableResolutions is incorrect`, async () => {
    const incorrectAvailableResolutions = await getRequest()
      .post(`${RouterPath.videos}`)
      .send({
        title: 'title',
        author: 'author',
        availableResolutions: ['144'],
      })
      .expect(HTTP_STATUSES.BAD_REQUEST_400)

    expect(incorrectAvailableResolutions.body).toEqual({
      errorsMessages: [
        { message: expect.any(String), field: 'availableResolutions' },
      ],
    })

    const res = await getRequest().get(`${RouterPath.videos}`)
    expect(res.body).toEqual([])
  })

  let createdVideo: any = null
  it(`should create video`, async () => {
    const data = {
      title: 'title',
      author: 'author',
      availableResolutions: ['P144', 'P1080'],
    }
    const thisRequest = await getRequest()
      .post(RouterPath.videos)
      .send(data)
      .expect(HTTP_STATUSES.CREATED_201)

    createdVideo = thisRequest.body
    expect(createdVideo).toEqual({
      id: expect.any(Number),
      title: data.title,
      author: data.author,
      availableResolutions: data.availableResolutions,
      canBeDownloaded: false,
      minAgeRestriction: null,
      createdAt: expect.any(String),
      publicationDate: expect.any(String),
    })
    await getRequest()
      .get(RouterPath.videos)
      .expect(HTTP_STATUSES.OK_200, [createdVideo])
  })
})
