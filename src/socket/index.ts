import models from '@models'
import socketIO from 'socket.io'
import { checkToken } from '@libs/auth'
import moment from 'moment'
export default function initSocket(io: socketIO.Server) {
    // auth
    io.use(async (socket, next) => {
        try {
            const id = checkToken(socket.request.headers.accesstoken)
            const { nickname, avatar } = await models.user.findById(id)
            socket.userInfo = {
                id,
                nickname,
                avatar,
            }
            return next()
        } catch (e) {
            return next()
        }
    })
    io.on('connection', socket => {
        try {
            // 有人连接成功 广播 在线人数 和 已登录用户
            io.emit('online total', io.eio.clientsCount)
            if (socket.userInfo) {
                console.log('someone join', socket.userInfo)
                io.emit('someone join', socket.userInfo)
            }
            io.emit(
                'online users',
                Object.keys(io.sockets.connected)
                    .filter(item => io.sockets.connected[item].userInfo)
                    .map(item => io.sockets.connected[item].userInfo)
            )
            socket.on('disconnect', packet => {
                // 断开连接 再次广播 在线人数 和 已登录用户
                io.emit('online total', io.eio.clientsCount)
                if (socket.userInfo) {
                    console.log('someone leave', socket.userInfo)
                    io.emit('someone leave', socket.userInfo)
                }
                io.emit(
                    'online users',
                    Object.keys(io.sockets.connected)
                        .filter(item => io.sockets.connected[item].userInfo)
                        .map(item => io.sockets.connected[item].userInfo)
                )
            })
            // socket中间件 发送消息必须登录
            socket.use((packet, next) => {
                if (socket.userInfo) {
                    const datetime = moment().format('YYYY-MM-DD HH:mm:ss')
                    const message = packet[1]
                    const type = packet[0]
                    models.chat_history.create({
                        user_id: socket.userInfo.id,
                        type,
                        message,
                        createdAt: datetime,
                    })
                    io.emit('broadcast', {
                        type,
                        userInfo: socket.userInfo,
                        message,
                        datetime,
                    })
                    return next()
                } else {
                    return next(new Error('尚未登录'))
                }
            })
        } catch (e) {
            console.warn(e)
        }
    })
}
