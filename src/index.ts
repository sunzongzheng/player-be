import app from './app'
import models from '@models'
import { createServer } from './app'

models.sequelize
    .sync({
        alter: true,
    })
    .then(() => createServer())
    .catch((e: Error) => {
        throw e
    })
