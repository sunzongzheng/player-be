import express from '@libs/express'
import models from '@models'
import moment from 'moment'
import config from 'config'
import { Session } from '@types'
import { Unauthorized } from '@libs/error'
import mailer from '@libs/mail'
import platform from 'platform'

const router = express()
const notEmailArr: Array<number> = config.get('avoidNotifyIDList')
const emailConfig: Config.email = config.get('email')

router.get('/', async (req, res) => {
    const session = req.session as Session
    const data = await models.user.findOne({
        where: {
            id: session.meta.id,
        },
    })
    if (data) {
        const date = moment().format('YYYY-MM-DD HH:mm:ss')
        models.user.update(
            {
                updatedAt: date,
            },
            {
                where: {
                    id: session.meta.id,
                },
            }
        )
        res.send({
            nickname: data.dataValues.nickname,
            avatar: data.dataValues.avatar,
        })
        let login_platform = '未知'
        try {
            const ua = (req.headers['user-agent'] || '').toString()
            const platformInfo = platform.parse(ua)
            if (ua.includes('okhttp')) {
                login_platform = '安卓'
            } else if (platformInfo.os.family) {
                login_platform = platformInfo.os.family
            }
            models.log_login.create({
                user_id: session.meta.id,
                from: 'token',
                platform: login_platform,
            })
        } catch (e) {
            console.log(e)
        }
        if (!notEmailArr.includes(session.meta.id)) {
            mailer.send({
                to: emailConfig.to,
                subject: '有老用户登录',
                text: `${data.dataValues.nickname}刚刚在${login_platform}平台上登录了系统`,
            })
        }
    } else {
        throw new Unauthorized('用户不存在')
    }
})

export default router
