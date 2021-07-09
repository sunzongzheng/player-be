import redis from "redis";
import {promisify} from "util";

export default class RedisCache {
    client: redis.RedisClient;
    get: (arg1: string) => Promise<string | null>;
    set: (arg1: string) => Promise<string | null>;

    constructor() {
        const host = process.env.APP_REDIS_HOST;
        const port = process.env.APP_REDIS_PORT ? parseInt(process.env.APP_REDIS_PORT) : 6379;
        console.log(`Trying to connect Redis instance: ${host}:${port}`);
        this.client = redis.createClient({
            host,
            port,
        });
        this.get = promisify(this.client.get).bind(this.client);
        this.set = promisify(this.client.set).bind(this.client);

        this.client.on('error', err => {
            console.log('Redis error ' + err)
        })
    }
}
