import express from '@libs/express'
import auth from './auth'
import playlist from './playlist'
import user from './user'
import music from './music'
import statistics from './statistics'

const router = express()
router.use('/auth', auth)
router.use('/playlist', playlist)
router.use('/user', user)
router.use('/music', music)
router.use('/statistics', statistics)
export default router
