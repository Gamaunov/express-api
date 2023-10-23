export const settings = {
  MONGO_URI:
    process.env.MONGO_URI ||
    'mongodb://0.0.0.0:27017/?maxPoolSize=20&w=majority',

  JWT_SECRET: process.env.JWT_SECRET || '123123',

  // REFRESH_SECRET: process.env.REFRESH_SECRET || '123123',
}
