import { UserModel, UserViewModel } from '../../../models'

export const userMapper = (user: UserModel): UserViewModel => {
  return {
    id: user._id.toHexString(),
    login: user.accountData.login,
    email: user.accountData.email,
    createdAt: user.accountData.createdAt,
  }
}
