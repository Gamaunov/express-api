import { NextFunction, Request, Response } from 'express'
import { ObjectId } from 'mongodb'

export function validateObjectId(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { id } = req.params

  if (!ObjectId.isValid(id)) {
    return res.sendStatus(404)
  }

  return next()
}
