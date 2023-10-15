import { WithId } from 'mongodb'

import { UserViewModel } from './UserViewModel'

export type UserDBModel = WithId<UserViewModel>
