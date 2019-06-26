import express from '@libs/express'
import { authWrite, generateToken } from '../../../libs/auth'
import axios from 'axios'
import { checkSchema, validationResult } from 'express-validator/check'

const router = express()

router.get(
    '/',
    checkSchema({
        access_token: {
            in: ['query'],
            isEmpty: {
                errorMessage: 'access_token不能为空',
                negated: true,
            },
        }
    }),
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        validationResult(req).throw()
        // 获取用户信息
        const data = await axios.get('https://api.github.com/user', {
            headers: {
                Authorization: `token ${req.query.access_token}`,
            },
        })
        const userInfo = data.data
        // 存储
        const info = await authWrite(req, {
            unionid: userInfo.id,
            nickname: userInfo.name,
            avatar: userInfo.avatar_url,
            sourceData: userInfo,
            from: 'github',
        })
        res.send({
            token: generateToken(info.id),
            nickname: info.nickname,
            avatar: info.avatar,
        })
    }
)

export default router
