import express from "@libs/express"
import { HttpError } from "@libs/error"
export default (error: HttpError, req: express.Request, res: express.Response, next: express.NextFunction) => {
    let msg, status
    if (error.array) {
        msg = error.array()[0].msg
        status = 400
    }
    const rs: { msg: any; log?: any } = {
        msg: msg || error.message
    }
    // 正式环境不返回log
    if (process.env.NODE_ENV !== "production") {
        rs.log = error.log || error
    }
    res.status(status || error.status || 500).send(rs)
}
