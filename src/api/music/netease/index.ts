import musicApi from '@suen/music-api'
import { rankIds } from './../../../validator/music/netease'
import express from '@libs/express'
import { checkSchema, validationResult } from 'express-validator/check'
import redis from '@redis'

const router = express()

router.get('/rank', checkSchema({ ids: rankIds }), async (req, res, next) => {
    validationResult(req).throw()
    const ids = req.query.ids
    const rs: {
        [key: number]: any
    } = {}
    for (let id of ids) {
        try {
            const cache = await redis.get(`netease-rank-${id}`)
            if (cache) {
                // 有缓存就读缓存
                rs[id] = JSON.parse(cache)
            } else {
                // 没缓存就实时查询 并写入缓存
                const data = await musicApi.netease.getTopList(id)
                if (data.status) {
                    rs[id] = data.data
                    redis.set(`netease-rank-${id}`, JSON.stringify(data.data))
                }
            }
        } catch (e) {
            console.warn(e)
        }
    }
    res.send(rs)
})

export default router
