import redis from 'redis'
import { promisify } from 'util'

const client = redis.createClient({
    host: process.env.APP_REDIS_HOST,
    port: process.env.APP_REDIS_PORT ? parseInt(process.env.APP_REDIS_PORT) : 6379,
})

client.on('error', err => {
    console.log('Redis error ' + err)
})

export default {
    get: promisify(client.get).bind(client),
    set: promisify(client.set).bind(client),
    raw: client,
}
