import express from '../libs/express'
import encrypt from '../libs/encrypt'
import { generateToken, checkToken } from '../libs/auth'
import { Unauthorized } from '../libs/error'
import { SessionMeta, Session } from '../types'
import moment from 'moment'

const router = express()
const noPermissionList = [
    '/auth/qq',
    '/auth/weibo',
    '/auth/qq/callback',
    '/auth/weibo/callback',
    '/auth/qq/android',
    '/auth/weibo/android',
    '/music/netease/rank',
    '/music/qq/rank',
    '/statistics',
]

router.use((req, res, next) => {
    if (noPermissionList.includes(req.path)) {
        next()
    } else {
        const token = req.header('accesstoken')
        const id = checkToken(token)
        process.env.NODE_ENV === 'development' && console.log('当前登录用户ID：' + id)
        const session = req.session as Session
        session.meta = {
            id,
            expire: moment()
                .add(14, 'd')
                .valueOf(),
        }
        res.locals.session = session
        next()
    }
})
export default router
