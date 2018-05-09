import { ErrorType } from "@types"
import { Result } from "express-validator/check"

export class HttpError extends Error {
    status: ErrorType
    log: any
    array?: Function
    constructor(message: string, type: ErrorType, log: any) {
        super(message)
        this.status = type
        this.log = log
    }
}
export class BadRequest extends HttpError {
    constructor(message: string, log?: any) {
        super(message, ErrorType.BadRequest, log)
    }
}
export class Unauthorized extends HttpError {
    constructor(message: string = "未授权", log?: any) {
        super(message, ErrorType.Unauthorized, log)
    }
}
export class Forbidden extends HttpError {
    constructor(message: string = "无权操作", log?: any) {
        super(message, ErrorType.Forbidden, log)
    }
}
export class SystemError extends HttpError {
    constructor(message: string = "系统错误", log?: any) {
        super(message, ErrorType.SystemError, log)
    }
}
