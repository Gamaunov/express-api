import { WithId } from 'mongodb'

import { MappedUserModel } from '../../models/MappedUserModel'
import { UserViewModel } from '../../models/UserViewModel'

export const userMapper = (user: WithId<UserViewModel>): MappedUserModel => {
  return {
    id: user._id.toHexString(),
    login: user.login,
    email: user.email,
    createdAt: user.createdAt,
  }
}
