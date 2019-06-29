import express from '../../libs/express'
import passport from 'passport'
import callback from './weibo/callback'
import android from './weibo/android'

const router = express()

router.get('/', (req, res, next) => {
    if(req.query.open_client) {
        passport.authenticate('weibo-open-client')(req, res, next)
    } else {
        passport.authenticate('weibo')(req, res, next)
    }
})
router.use('/callback', callback)
router.use('/android', android)

export default router
