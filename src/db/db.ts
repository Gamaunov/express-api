import dotenv from 'dotenv'
import { MongoClient } from 'mongodb'

import { BlogType, PostType } from './dbTypes'

dotenv.config()

const mongoURI = process.env.MONGO_URL || 'mongodb://0.0.0.0:27017'

// console.log(process.env.MONGO_URL)

const client = new MongoClient(mongoURI)
export const db = client.db('hw03')
export const blogsCollection = db.collection<BlogType>('blogs')
export const postsCollection = db.collection<PostType>('posts')

export async function runDb() {
  try {
    await client.connect()

    await client.db('routes').command({ ping: 1 })

    console.log('mongoDb successfully connected')
  } catch {
    console.log("Smth went wrong, can't connect to mongoDb")
    await client.close()
  }
}
