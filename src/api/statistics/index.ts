import express from '@libs/express'
import models from '@models'
import { Op } from 'sequelize'

const router = express()

router.get('/', async (req, res) => {
    const newUser = await models.user.findAll({
        where: {
            createdAt: {
                [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0)),
                [Op.lte]: new Date(new Date().setHours(24, 0, 0, 0)),
            },
        },
        attributes: ['nickname', 'createdAt'],
    })
    const uv = await models.user.findAll({
        where: {
            updatedAt: {
                [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0)),
                [Op.lte]: new Date(new Date().setHours(24, 0, 0, 0)),
            },
        },
        attributes: ['nickname', 'createdAt'],
    })
    res.send(`今日新增用户数：${newUser.length}<br/>今日登录用户数：${uv.length}`)
})

export default router
