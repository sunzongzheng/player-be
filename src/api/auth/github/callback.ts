import express from '@libs/express'
import passport from 'passport'
import { RequestWithUser } from 'passport-qq'
import { authWrite, generateToken } from '@libs/auth'

const router = express()

router.get('/', passport.authenticate('github'), async (req, res, next) => {
    const _req: RequestWithUser = req as RequestWithUser
    const data = _req.user._json

    const info = await authWrite(req, {
        unionid: data.id,
        nickname: data.name,
        avatar: data.avatar_url,
        sourceData: data,
        from: 'github',
    })
    const accesstoken = generateToken(info.id)
    res.cookie('accesstoken', accesstoken, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    })
    res.send('登录成功')
})

export default router
