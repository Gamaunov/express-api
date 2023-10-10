import { app } from './app'
import { runDb } from './db/db'

export const port = process.env.PORT || 5000

const startApp = async () => {
  await runDb()
  app.listen(port, () => {
    console.log(`listening port:: ${port}`)
  })
}

startApp()
