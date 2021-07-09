import LocalCache from "@src/redis/LocalCache";
import RedisCache from "@src/redis/RedisCache";

const {get, set, client} = (() => {
    // Use RAM as cache if there is no Redis
    if (process.env.APP_REDIS_HOST) {
        return new RedisCache();
    } else {
        console.log(`Tip: set APP_REDIS_HOST and APP_REDIS_PORT to use Redis as cache.`);
        return new LocalCache();
    }
})();

export default {
    get,
    set,
    raw: client,
}
