import { NextFunction, Request, Response } from 'express'

export const checkBasicMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (req.headers.authorization !== 'Basic YWRtaW46cXdlcnR5') {
    res.sendStatus(401)
  } else {
    next()
  }
}
