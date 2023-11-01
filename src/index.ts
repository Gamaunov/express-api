import { app } from './app'
import { runDb } from './db/db'

export const port = process.env.PORT || 5000

const startApp = async (): Promise<void> => {
  await runDb()
  app.listen(port, (): void => {
    console.log(`http://localhost:${port}, ✔`)
  })
}

startApp()
