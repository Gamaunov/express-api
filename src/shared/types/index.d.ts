import { ObjectId } from 'mongodb'

import { UserAccountDBModel } from '../../models'

declare global {
  namespace Express {
    export interface Request {
      user: UserAccountDBModel | null
      userId: ObjectId
    }
  }
}
