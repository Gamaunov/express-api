import { NextFunction, Request, Response } from 'express'

import { securityDevicesRepository } from '../../reposotories/securityDevices-repository'

export const CountOfLoginAttempts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const rateLimit = new Date(Number(new Date()) - 10000)

  const countOfLA = await securityDevicesRepository.getLAByURLAndIp(
    req.ip,
    req.url,
    rateLimit,
  )

  await securityDevicesRepository.createLA(req.ip, req.url, new Date())

  if (countOfLA >= 5) return res.sendStatus(429)

  return next()
}
