import express from "@libs/express"
import models from "@models"
import moment from "moment"
import config from "config"
import { Session } from "@types"
import { Unauthorized } from "@libs/error"
import mailer from "@libs/mail"

const router = express()
const notEmailArr: Array<number> = config.get("avoidNotifyIDList")
const emailConfig: Config.email = config.get("email")

router.get("/", async (req, res) => {
    const session = req.session as Session
    const data = await models.user.findOne({
        where: {
            id: session.meta.id
        }
    })
    if (data) {
        const date = moment().format("YYYY-MM-DD HH:mm:ss")
        models.user.update(
            {
                updatedAt: date
            },
            {
                where: {
                    id: session.meta.id
                }
            }
        )
        res.send({
            data: {
                nickname: data.dataValues.nickname,
                avatar: data.dataValues.avatar
            }
        })
        if (!notEmailArr.includes(session.meta.id)) {
            mailer.send({
                to: emailConfig.to,
                subject: "有老用户登录",
                text: `${data.dataValues.nickname}刚刚登录了系统`
            })
        }
    } else {
        throw new Unauthorized("用户不存在")
    }
})

export default router
