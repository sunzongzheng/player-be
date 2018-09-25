import express from '@libs/express'
import netease from './netease'
import qq from './qq'

const router = express()

router.use('/netease', netease)
router.use('/qq', qq)

export default router
