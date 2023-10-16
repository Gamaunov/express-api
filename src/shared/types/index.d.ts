import { UserDBTypeModel } from '../../models'

declare global {
  namespace Express {
    export interface Request {
      user: UserDBTypeModel | null
    }
  }
}
