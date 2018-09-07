import express from '@libs/express'
import models from '@models'
import Sequelize, { Op } from 'sequelize'
import moment from 'moment'

const router = express()

router.get('/', async (req, res) => {
    const start = moment()
        .subtract(1, 'month')
        .format('YYYY-MM-DD  00:00:00')
    const newUserStatistics = await models.user.findAll({
        where: {
            createdAt: {
                [Op.gte]: new Date(start),
            },
        },
        attributes: [
            [Sequelize.fn('DATE', Sequelize.col('createdAt')), 'createdAt'],
            [Sequelize.fn('count', Sequelize.col('createdAt')), 'count'],
        ],
        group: Sequelize.fn('DATE', Sequelize.col('createdAt')),
    })
    const newUser = await models.user.findAll({
        where: {
            createdAt: {
                [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0)),
            },
        },
    })
    const uv = await models.user.findAll({
        where: {
            updatedAt: {
                [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0)),
            },
        },
    })
    res.render(__dirname + '/index.art', {
        tableOption: JSON.stringify({
            title: {
                text: '最近一个月新增用户统计',
            },
            tooltip: {},
            legend: {
                data: ['新增用户数'],
            },
            xAxis: {
                data: newUserStatistics.map((item: any) => item.createdAt),
            },
            yAxis: {},
            series: [
                {
                    name: '新增用户数',
                    type: 'line',
                    data: newUserStatistics.map((item: any) => item.dataValues.count),
                },
            ],
        }),
        newUser: newUser.length,
        uv: uv.length,
    })
})

export default router
