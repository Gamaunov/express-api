import { MappedUserModel, UserAccountDBModel } from '../../../models'

export const userMapper = (user: UserAccountDBModel): MappedUserModel => {
  return {
    id: user._id.toHexString(),
    login: user.accountData.login,
    email: user.accountData.email,
    createdAt: user.accountData.createdAt,
  }
}
