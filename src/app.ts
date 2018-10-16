import express from '@libs/express'
import session from 'express-session'
import bodyParser from 'body-parser'
import redis from 'socket.io-redis'
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

const expressServer = require('http').createServer(app)
const socketServer = require('http').createServer()
const io = socketIO(socketServer)

io.adapter(redis({ host: 'localhost', port: 6379 }))

initSocket(io)

process.on('SIGINT', function() {
    expressServer.close(function(err) {
        process.exit(err ? 1 : 0)
    })
})

export function createServer() {
    socketServer.listen(serverConfig.socket + parseInt(process.env.NODE_APP_INSTANCE))
    expressServer.listen(serverConfig.port, () => {
        process.send && process.send('ready')
        if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test') {
            console.log(`server running @${serverConfig.port}`)
        }
    })
}

export default app
