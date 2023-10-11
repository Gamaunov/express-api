import { WithId } from 'mongodb'

import { UserOutput } from '../../../../db/dbTypes'
import { UserViewModel } from '../../models/UserViewModel'

export const userMapper = (user: WithId<UserViewModel>): UserOutput => {
  return {
    id: user._id.toHexString(),
    login: user.login,
    email: user.email,
    createdAt: user.createdAt,
  }
}
