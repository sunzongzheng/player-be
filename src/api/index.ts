import express from '@libs/express'
import auth from './auth'
import playlist from './playlist'
import user from './user'
import music from './music'
import statistics from './statistics'
import chatHistory from './chat-history'

const router = express()
router.use('/auth', auth)
router.use('/playlist', playlist)
router.use('/user', user)
router.use('/music', music)
router.use('/statistics', statistics)
router.use('/chat-history', chatHistory)
export default router
