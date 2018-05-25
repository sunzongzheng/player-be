declare module 'passport-qq' {
    import passport = require('passport')
    import express = require('express')
    export interface Profile extends passport.Profile {
        provider: string
        id: string
        nickname: string
        _json: any
        _raw: string
    }

    export interface StrategyOption {
        clientID: number
        clientSecret: string
        callbackURL: string
    }

    export interface RequestWithUser extends express.Request {
        user: any
    }

    export type VerifyFunction = (
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: (error: any, user?: any, info?: any) => void
    ) => void

    export class Strategy extends passport.Strategy {
        constructor(options: StrategyOption, verify: VerifyFunction)

        authenticate(req: express.Request, options?: object): void
        name: string
    }
}
