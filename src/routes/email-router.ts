import dotenv from 'dotenv'
import { Router } from 'express'

import { emailService } from '../domain/email-service'

dotenv.config()

export const emailRouter = Router({})

emailRouter.post('/send', async (req, res) => {
  await emailService.doOperation(
    req.body.email,
    req.body.subject,
    req.body.message,
  )
  res.sendStatus(200)
})
