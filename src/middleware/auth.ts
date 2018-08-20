import express from '../libs/express'
import encrypt from '../libs/encrypt'
import { generateToken } from '../libs/auth'
import { Unauthorized } from '../libs/error'
import { SessionMeta, Session } from '../types'
import moment from 'moment'

const router = express()
const noPermissionList = ['/auth/qq', '/auth/qq/callback', '/auth/qq/android', '/music/netease/rank']

router.use((req, res, next) => {
    if (noPermissionList.includes(req.path)) {
        next()
    } else {
        const token = req.header('accesstoken')
        if (token) {
            const entry = encrypt.decode(token)
            process.env.NODE_ENV === 'development' && console.log('当前登录用户ID：' + entry.id)
            const session = req.session as Session
            if (entry && entry.id) {
                if (entry.expire && moment(entry.expire).isBefore(moment())) {
                    throw new Unauthorized('登录过期')
                } else {
                    session.meta = {
                        id: entry.id,
                        expire: moment()
                            .add(14, 'd')
                            .valueOf(),
                    }
                    res.locals.session = session
                    next()
                }
            } else {
                throw new Unauthorized('尚未登录')
            }
        } else {
            throw new Unauthorized('尚未登录')
        }
    }
})
export default router
