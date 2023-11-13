import { Router } from 'express'

import { container } from '../composition-root'
import { SecurityDevicesController } from '../controllers/securityDevices.controller'
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
