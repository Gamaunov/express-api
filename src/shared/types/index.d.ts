import { UserDBTypeModel } from '../../features/users'

declare global {
  namespace Express {
    export interface Request {
      user: UserDBTypeModel | null
    }
  }
}
