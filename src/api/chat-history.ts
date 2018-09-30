import express from '@libs/express'
import models from '@models'
import Sequelize, { Op } from 'sequelize'
import moment from 'moment'
import { schema, validate } from '@libs/validator'
import { start_dt, end_dt } from '@validator/chat-history'

const router = express()

router.get(
    '/',
    schema({
        start_dt,
        end_dt,
    }),
    async (req, res) => {
        validate(req).throw()
        const dbQueryWhere = {
            createdAt: {},
        }
        if (req.query.start_dt) {
            Object.assign(dbQueryWhere.createdAt, {
                [Op.gte]: new Date(req.query.start_dt),
            })
        }
        if (req.query.end_dt) {
            Object.assign(dbQueryWhere.createdAt, {
                [Op.lte]: new Date(req.query.end_dt),
            })
        }
        const data = await models.chat_history.findAll({
            where: Object.getOwnPropertySymbols(dbQueryWhere.createdAt).length ? dbQueryWhere : {},
            include: [
                {
                    model: models.user,
                    attributes: ['avatar', 'nickname'],
                },
            ],
            order: [['createdAt', 'ASC']],
        })
        res.send(
            data.map((item: any) => {
                return {
                    type: item.type,
                    userInfo: {
                        id: item.user_id,
                        nickname: item.user.nickname,
                        avatar: item.user.avatar,
                        platform: item.platform,
                    },
                    message: item.message,
                    datetime: moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss'),
                }
            })
        )
    }
)

export default router
