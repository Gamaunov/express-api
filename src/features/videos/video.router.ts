import express, { Response } from 'express'

import {
  DBType,
  ErrorType,
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  RequestWithQuery,
  VideoType,
} from '../../shared/types/types'
import { HTTP_STATUSES } from '../../shared/utils/http-statuses'
import { errors, isValidFields } from './helpers/isValidFields'
import { CreateVideoModel } from './models/CreateVideoModel'
import { QueryVideoModel } from './models/QueryVideoModel'
import { UpdateVideoModel } from './models/UpdateVideoModel'
import { VideoViewModel } from './models/VideoViewModel'
import { getVideoViewModel } from './models/getVideoViewModel'

export const getVideoRouter = (db: DBType) => {
  const router = express.Router()

  router.get(`/`, (req: RequestWithQuery<QueryVideoModel>, res: Response) => {
    const { title } = req.query
    let filteredVideos = db.video

    if (title) {
      filteredVideos = filteredVideos.filter((video) =>
        video.title.includes(title),
      )
    }

    const videoViewModels = filteredVideos.map(getVideoViewModel)
    res.json(videoViewModels)
  })

  router.get(
    `/:id`,
    (req: RequestWithParams<{ id: string }>, res: Response<VideoViewModel>) => {
      let foundVideo = db.video.find((v) => v.id === +req.params.id)
      foundVideo
        ? res.status(HTTP_STATUSES.OK_200).send(foundVideo)
        : res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    },
  )

  router.post(
    `/`,
    (
      req: RequestWithBody<CreateVideoModel>,
      res: Response<VideoViewModel | ErrorType>,
    ) => {
      let { title, author, availableResolutions } = req.body

      if (isValidFields(title, author, availableResolutions)) {
        res.status(HTTP_STATUSES.BAD_REQUEST_400).send(errors)
        errors.errorsMessages = []
        return
      }

      const createdAt = new Date()
      const publicationDate = new Date()

      publicationDate.setDate(createdAt.getDate() + 1)

      const newVideo: VideoType = {
        id: +new Date(),
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: createdAt.toISOString(),
        publicationDate: publicationDate.toISOString(),
        title,
        author,
        availableResolutions,
      }

      db.video.push(newVideo)
      res.status(HTTP_STATUSES.CREATED_201).send(newVideo)
    },
  )

  router.put(
    `/:id`,
    (req: RequestWithParamsAndBody<{ id: string }, UpdateVideoModel>, res) => {
      let {
        title,
        author,
        availableResolutions,
        canBeDownloaded = false,
        minAgeRestriction = null,
      } = req.body

      if (
        isValidFields(
          title,
          author,
          availableResolutions,
          canBeDownloaded,
          minAgeRestriction,
        )
      ) {
        res.status(HTTP_STATUSES.BAD_REQUEST_400).send(errors)
        errors.errorsMessages = []
        return
      }

      const createdAt = new Date()
      const publicationDate = new Date()

      publicationDate.setDate(createdAt.getDate() + 1)

      const updatedVideo: VideoType = {
        id: +new Date(),
        createdAt: createdAt.toISOString(),
        publicationDate: publicationDate.toISOString(),
        canBeDownloaded,
        minAgeRestriction,
        title,
        author,
        availableResolutions,
      }

      const videoIndex = db.video.findIndex((i) => i.id === +req.params.id)

      if (videoIndex === -1) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
      }

      db.video[videoIndex] = {
        ...db.video[videoIndex],
        ...updatedVideo,
      }

      res.status(HTTP_STATUSES.NO_CONTENT_204).send(db.video[videoIndex])
    },
  )

  router.delete(`/:id`, (req: RequestWithParams<{ id: string }>, res) => {
    const videoIdToDelete = +req.params.id

    const foundVideo = db.video.some((v) => v.id === videoIdToDelete)

    if (foundVideo) {
      db.video = db.video.filter((v) => v.id !== videoIdToDelete)
      return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    } else {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }
  })

  return router
}
