import express from '@libs/express'
import passport from 'passport'
import config from 'config'
import axios from 'axios'
import { Strategy as qqStrategy, StrategyOption } from 'passport-qq'
import qq from './auth/qq'

const router = express()
const qqStrategyOption: StrategyOption = config.get('qqStrategyOption')
const serializeUser = (user: any, done: Function) => {
    done(null, user)
}

passport.serializeUser(serializeUser)
passport.deserializeUser(serializeUser)
passport.use(
    new qqStrategy(qqStrategyOption, async (accessToken, refreshToken, profile, done) => {
        // 获取unionID
        const data = await axios.get(`https://graph.qq.com/oauth2.0/me?access_token=${accessToken}&unionid=1`)
        const info = eval(`function callback(val){return val} ${data.data}`)
        done(null, {
            ...profile,
            unionid: info.unionid,
        })
    })
)
router.use(passport.initialize())
router.use(passport.session())
router.use('/qq', qq)

export default router
