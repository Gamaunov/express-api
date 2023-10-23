import { WithId } from 'mongodb'

import { EmailConfirmationModel } from '../email/EmailConfirmationModel'
import { UserAccountModel } from './UserAccountModel'

export type UserAccountDBModel = WithId<{
  accountData: UserAccountModel
  emailConfirmation: EmailConfirmationModel
  refreshTokenBlackList: string[]
}>
