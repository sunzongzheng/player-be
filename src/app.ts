import express from '@libs/express'
import session from 'express-session'
import bodyParser from 'body-parser'
import config from 'config'
import middleware from './middleware'
import socketIO from 'socket.io'
import initSocket from './socket'

const app = express()
const serverConfig: Config.server = config.get('server')
const sessionConfig: Config.session = config.get('session')

app.engine('art', require('express-art-template'))
app.set('view options', {
    debug: process.env.NODE_ENV !== 'production',
})
app.use(session(sessionConfig))
app.use(bodyParser.json())
app.use(middleware)

const server = require('http').createServer(app)
const io = socketIO(server)

initSocket(io)

export function createServer() {
    server.listen(serverConfig.port, () => {
        if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test') {
            console.log(`server running @${serverConfig.port}`)
        }
    })
}

export default app
