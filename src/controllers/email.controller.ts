import { Response } from 'express'
import { inject, injectable } from 'inversify'

import { EmailService } from '../application/email.service'
import { EmailViewModel } from '../models'
import { RequestWithBody } from '../shared'

@injectable()
export class EmailController {
  constructor(@inject(EmailService) protected emailService: EmailService) {}
  async sendEmail(req: RequestWithBody<EmailViewModel>, res: Response) {
    await this.emailService.doOperation(
      req.body.email,
      req.body.subject,
      req.body.message,
    )
    res.sendStatus(200)
  }
}
