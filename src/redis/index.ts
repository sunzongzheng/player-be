import redis from 'redis'
import { promisify } from 'util'

const client = redis.createClient()

client.on('error', err => {
    console.log('Redis error ' + err)
})

export default {
    get: promisify(client.get).bind(client),
    set: promisify(client.set).bind(client),
    raw: client,
}
