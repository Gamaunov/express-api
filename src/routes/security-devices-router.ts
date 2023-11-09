import { Router } from 'express'

import { container } from '../composition-root'
import { SecurityDevicesController } from '../controllers/SecurityDevicesController'
import { checkForRefreshToken, deviceIdMiddleware } from '../middlewares'

export const securityDevicesRouter = Router({})
const securityDevicesController = container.resolve(SecurityDevicesController)

securityDevicesRouter.get(
  '/',
  checkForRefreshToken,
  securityDevicesController.getDevices.bind(securityDevicesController),
)

securityDevicesRouter.delete(
  '/:deviceId',
  deviceIdMiddleware,
  securityDevicesController.deleteDevice.bind(securityDevicesController),
)

securityDevicesRouter.delete(
  '/',
  checkForRefreshToken,
  securityDevicesController.deleteDevices.bind(securityDevicesController),
)
