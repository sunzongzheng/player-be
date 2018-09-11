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
            androidLoginUser: 0,
            pcLoginUser: 0,
        })
    }

    // 新增用户统计
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
    // 当日新增用户
    const newUser = await models.user.findAll({
        where: {
            createdAt: {
                [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0)),
            },
        },
    })
    // 登录用户统计
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
    // 当日登录用户
    const uv = await models.user.findAll({
        where: {
            updatedAt: {
                [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0)),
            },
        },
    })
    // 安卓登录用户统计
    const AndroidUvStatistics = await models.log_login.findAll({
        where: {
            createdAt: {
                [Op.gte]: new Date(start),
            },
            platform: '安卓',
        },
        attributes: [
            [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('user_id'))), 'count'],
            [Sequelize.fn('DATE', Sequelize.col('createdAt')), 'createdAt'],
        ],
        group: Sequelize.fn('DATE', Sequelize.col('createdAt')),
    })
    AndroidUvStatistics.forEach((item: any) => {
        const date = item.dataValues.createdAt
        const index = moment(date).diff(moment(start), 'day')
        statisticsData[index].androidLoginUser += item.dataValues.count
    })
    // PC登录用户统计
    const pcUvStatistics = await models.log_login.findAll({
        where: {
            createdAt: {
                [Op.gte]: new Date(start),
            },
            platform: {
                [Op.ne]: '安卓',
            },
        },
        attributes: [
            [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('user_id'))), 'count'],
            [Sequelize.fn('DATE', Sequelize.col('createdAt')), 'createdAt'],
        ],
        group: Sequelize.fn('DATE', Sequelize.col('createdAt')),
    })
    pcUvStatistics.forEach((item: any) => {
        const date = item.dataValues.createdAt
        const index = moment(date).diff(moment(start), 'day')
        statisticsData[index].pcLoginUser += item.dataValues.count
    })
    res.render(__dirname + '/index.art', {
        xAxis: JSON.stringify(statisticsData.map((item: any) => item.date)),
        newUserStatistics: JSON.stringify(statisticsData.map((item: any) => item.newUser)),
        newUser: newUser.length,
        loginUserStatistics: JSON.stringify(statisticsData.map((item: any) => item.loginUser)),
        loginUser: uv.length,
        androidLoginUserStatics: JSON.stringify(statisticsData.map((item: any) => item.androidLoginUser)),
        pcLoginUserStatics: JSON.stringify(statisticsData.map((item: any) => item.pcLoginUser)),
    })
})

export default router
