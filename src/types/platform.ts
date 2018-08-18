declare interface Platform {
    description?: string
    layout?: string
    manufacturer?: string
    name?: string
    prerelease?: string
    product?: string
    ua?: string
    version?: string
    os: {
        architecture?: number
        family?: string
        version?: string
        toString(): string
    }
    parse(ua: string): Platform
    toString?(): string
}

declare var platform: Platform

declare module 'platform' {
    export = platform
}
