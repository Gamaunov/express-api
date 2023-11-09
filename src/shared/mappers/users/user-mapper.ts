import { MappedUserModel, UserModel } from '../../../models'

export const userMapper = (user: UserModel): MappedUserModel => {
  return {
    id: user._id.toHexString(),
    login: user.accountData.login,
    email: user.accountData.email,
    createdAt: user.accountData.createdAt,
  }
}
