import { app } from './app'
import { runDb } from './db/db'

const port = process.env.PORT || 3000

const startApp = async () => {
  await runDb()
  app.listen(port, () => {
    console.log(`listening port:: ${port}`)
  })
}

startApp()
