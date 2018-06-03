import { PathParams } from 'express-serve-static-core'
declare module 'express-serve-static-core' {
    export interface IRouterMatcher<T> {
        (path: PathParams, ...handlers: RequestHandler[]): T
        (path: PathParams, middleware: any, ...handlers: RequestHandler[]): T
        (path: PathParams, ...handlers: RequestHandlerParams[]): T
    }
}
