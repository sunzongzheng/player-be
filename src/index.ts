import models from '@models'
import { createServer } from './app'
import createCron from './cron'

models.sequelize
    .sync({
        alter: true,
    })
    .catch((e: Error) => {
        throw e
    })
    .finally(() => {
        createCron()
        createServer()
    })
