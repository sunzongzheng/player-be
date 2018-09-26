import express from '../../libs/express'
import passport from 'passport'
import callback from './weibo/callback'
import android from './weibo/android'

const router = express()

router.get('/', passport.authenticate('weibo'), (req, res) => {})
router.use('/callback', callback)
router.use('/android', android)

export default router
