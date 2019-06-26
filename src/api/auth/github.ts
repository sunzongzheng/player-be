import express from '../../libs/express'
import passport from 'passport'
import callback from './github/callback'
import android from './github/android'

const router = express()

router.get('/', passport.authenticate('github'), (req, res) => {})
router.use('/callback', callback)
router.use('/android', android)

export default router
