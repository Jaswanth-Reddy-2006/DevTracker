import Redis from 'ioredis'

let redisClient = null
let usingRedis = false

if (process.env.REDIS_URL) {
  try {
    redisClient = new Redis(process.env.REDIS_URL)
    usingRedis = true
    redisClient.on('error', (e) => console.warn('redis error', e))
  } catch (err) {
    console.warn('redisClient: failed to initialize', err)
    redisClient = null
    usingRedis = false
  }
}

export { redisClient, usingRedis }
