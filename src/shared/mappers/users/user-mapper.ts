import { WithId } from 'mongodb'

import { MappedUserModel, UserViewModel } from '../../../models'

export const userMapper = (user: WithId<UserViewModel>): MappedUserModel => {
  return {
    id: user._id.toHexString(),
    login: user.login,
    email: user.email,
    createdAt: user.createdAt,
  }
}
