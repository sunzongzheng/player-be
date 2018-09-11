import express from '@libs/express'
import models from '@models'
import Sequelize, { Op } from 'sequelize'
import moment from 'moment'

const router = express()

router.get('/', async (req, res) => {
    const start = moment()
        .subtract(1, 'month')
        .format('YYYY-MM-DD 00:00:00')
    const statisticsData: any = []
    for (let i = 0; ; i++) {
        const date = moment(start).add(i, 'day')
        if (date.isAfter(moment(), 'd')) {
            break
        }
        statisticsData.push({
            date: date.format('YYYY-MM-DD'),
            newUser: 0,
            loginUser: 0,
        })
    }

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
    newUserStatistics.forEach((item: any) => {
        const date = item.dataValues.createdAt
        const index = moment(date).diff(moment(start), 'day')
        statisticsData[index].newUser += item.dataValues.count
    })
    const newUser = await models.user.findAll({
        where: {
            createdAt: {
                [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0)),
            },
        },
    })
    const uvStatistics = await models.log_login.findAll({
        where: {
            createdAt: {
                [Op.gte]: new Date(start),
            },
        },
        attributes: [
            [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('user_id'))), 'count'],
            [Sequelize.fn('DATE', Sequelize.col('createdAt')), 'createdAt'],
        ],
        group: Sequelize.fn('DATE', Sequelize.col('createdAt')),
    })
    uvStatistics.forEach((item: any) => {
        const date = item.dataValues.createdAt
        const index = moment(date).diff(moment(start), 'day')
        statisticsData[index].loginUser += item.dataValues.count
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
                data: ['新增用户数', '登录用户数'],
            },
            xAxis: {
                data: statisticsData.map((item: any) => item.date),
            },
            yAxis: {},
            series: [
                {
                    name: '新增用户数',
                    type: 'line',
                    data: statisticsData.map((item: any) => item.newUser),
                },
                {
                    name: '登录用户数',
                    type: 'line',
                    data: statisticsData.map((item: any) => item.loginUser),
                },
            ],
        }),
        newUser: newUser.length,
        uv: uv.length,
    })
})

export default router
