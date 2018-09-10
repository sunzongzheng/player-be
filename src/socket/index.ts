import socketIO from 'socket.io'
import { checkToken } from '@libs/auth'
export default function initSocket(io: socketIO.Server) {
    // auth
    io.use((socket, next) => {
        try {
            checkToken(socket.request.headers.accesstoken)
            return next()
        } catch (e) {
            next(e)
        }
    })
    io.on('connection', socket => {
        io.emit('online total', io.eio.clientsCount)
    })
}
