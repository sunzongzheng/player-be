export default class LocalCache {
    map = new Map();
    client = this;

    constructor() {
        console.log(`Use RAM as cache.`);
        this.get = this.get.bind(this);
        this.set = this.set.bind(this);
    }

    async get(key: string) {
        return this.map.get(key);
    }

    async set(key: string, value: string) {
        return this.map.set(key, value);
    }
}
