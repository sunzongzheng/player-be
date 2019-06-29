import express from '../../libs/express'
import passport from 'passport'
import callback from './qq/callback'
import android from './qq/android'

const router = express()

router.get('/', (req, res, next) => {
    if(req.query.open_client) {
        passport.authenticate('qq-open-client')(req, res, next)
    } else {
        passport.authenticate('qq')(req, res, next)
    }
})
router.use('/callback', callback)
router.use('/android', android)

export default router
