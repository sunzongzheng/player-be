import express from '../../libs/express'
import passport from 'passport'
import callback from './github/callback'
import android from './github/android'

const router = express()

router.get('/', (req, res, next) => {
    if(req.query.open_client) {
        passport.authenticate('github-open-client')(req, res, next)
    } else {
        passport.authenticate('github')(req, res, next)
    }
})
router.use('/callback', callback)
router.use('/android', android)

export default router
