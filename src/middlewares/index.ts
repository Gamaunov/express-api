export { validateObjectId } from './common/objectIdMiddleware'

export { authGuardMiddleware } from './auth/authGuardMiddleware'
export { authBearerMiddleware } from './auth/authBearerMiddleware'
export { authValidation } from './auth/authValidationMiddleware'
export { checkEmailCode } from './auth/checkEmailCode'
export { emailValidation } from './auth/emailValidationMiddleware'
export { checkRefreshToken } from './auth/checkRefreshToken'
export { checkForRefreshToken } from './auth/checkForRefreshToken'
export { deviceIdMiddleware } from './auth/deviceIdMiddleware'
export { checkBasicMiddleware } from './auth/checkBasicMiddleware'
export { tokenParser } from './auth/tokenParser'

export { validateBlog } from './blogs/blogValidationMiddleware'

export { validateComment } from './comments/commentValidationMiddleware'
export { findCommentByCommentIdFromParams } from './comments/findCommentByCommentIdFromParams'
export { likesValidation } from './comments/likesValidation'

export { findPostByIdFromParams } from './posts/findPostByIdFromParams'
export { postValidation } from './posts/postValidationMiddleware'

export { userValidation } from './users/userValidationMiddleware'
export { checkLoginAndEmail } from './users/checkLoginAndEmail'
export { checkEmail } from './users/checkEmail'

export { errorsValidation } from './common/errorsValidation'
