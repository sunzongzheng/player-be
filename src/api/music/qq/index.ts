import { isUndefined } from 'util'
import musicApi from '@suen/music-api'
import { limit } from './../../../validator/music/netease'
import { rankIds } from './../../../validator/music/qq'
import express from '@libs/express'
import { checkSchema, validationResult } from 'express-validator/check'
import redis from '@redis'
import { getQQRank } from '../../../scripts'

const router = express()

router.get('/rank', checkSchema({ limit: limit, ids: rankIds }), async (req, res, next) => {
    validationResult(req).throw()
    const ids = req.query.ids
    const limit = isNaN(parseInt(req.query.limit)) ? undefined : parseInt(req.query.limit)
    try {
        if (isUndefined(ids)) {
            const cache = await redis.get(`qq-rank-total`)
            let answer
            if (cache) {
                // 有缓存就读缓存
                answer = JSON.parse(cache)
                if (!answer.length) {
                    answer = await getQQRank()
                }
            } else {
                // 没缓存就实时查询 并写入缓存
                answer = await getQQRank()
            }
            answer = answer.map((item: any) => {
                item.list = item.list.slice(0, limit)
                return item
            })
            res.send(answer)
        } else {
            const rs = []
            for (let id of ids) {
                try {
                    const cache = await redis.get(`qq-rank-${id}`)
                    let answer
                    if (cache) {
                        // 有缓存就读缓存
                        answer = JSON.parse(cache)
                    } else {
                        // 没缓存就实时查询 并写入缓存
                        const data = await musicApi.qq.getTopList(id)
                        if (data.status) {
                            answer = data.data
                            redis.set(`qq-rank-${id}`, JSON.stringify(data.data))
                        }
                    }
                    answer.list = answer.list.slice(0, limit)
                    rs.push(answer)
                } catch (e) {
                    console.warn(e)
                }
            }
            res.send(rs)
        }
    } catch (e) {
        console.warn(e)
        res.send([])
    }
})

export default router
