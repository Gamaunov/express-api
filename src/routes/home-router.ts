import { Router } from 'express'

import { homeController } from '../controllers/HomeController'

export const homeRouter = Router({})

homeRouter.get('/', homeController.home.bind(homeController))
