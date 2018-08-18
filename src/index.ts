import models from '@models'
import { createServer } from './app'
import createCron from './cron'

models.sequelize
    .sync({
        alter: true,
    })
    .then(() => {
        createCron()
        createServer()
    })
    .catch((e: Error) => {
        throw e
    })
