import { NextFunction, Request, Response } from 'express'

export const CheckRTMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.cookies.refreshToken) return res.sendStatus(401)

  return next()
}
