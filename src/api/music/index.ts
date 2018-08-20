import express from '@libs/express'
import netease from './netease'

const router = express()

router.use('/netease', netease)

export default router
