import { Op } from 'sequelize'
import models from '@models'
import config from 'config'
import { SessionMeta } from '@types'
import encrypt from '@libs/encrypt'
import mailer from '@libs/mail'
import moment from 'moment'
import axios from 'axios'
import { BadRequest, SystemError } from '@libs/error'

const notEmailArr: Array<number> = config.get('avoidNotifyIDList')
const emailConfig: Config.email = config.get('email')

interface UpdateDataOption {
  unionid: string
  nickname: string
  avatar: string
  sourceData: string
}

interface OPTIONS extends UpdateDataOption {
  sn: string
}

function findOrCreate(options: OPTIONS) {
  return models.user.findOrCreate({
    where: {
      [Op.or]: [
        {
          sn: options.sn,
        },
        {
          unionid: options.unionid,
        },
      ],
      from: 'qq',
    },
    defaults: {
      unionid: options.unionid,
      nickname: options.nickname,
      avatar: options.avatar,
      sourceData: options.sourceData,
    },
  })
}

function update(id: number, updateData: UpdateDataOption) {
  return models.user.update(updateData, {
    where: {
      id: id,
    },
  })
}

export async function qqAuthWrite(options: OPTIONS): Promise<Schema.user> {
  // 不存在插入
  let result = await findOrCreate(options)
  const info = result[0].dataValues
  // 存在更新
  if (!result[1]) {
    update(info.id, {
      nickname: options.nickname,
      avatar: options.avatar,
      sourceData: options.sourceData,
      unionid: options.unionid,
    })
  }
  // 邮件推送
  if (!notEmailArr.includes(info.id)) {
    mailer.send({
      to: emailConfig.to,
      subject: '有用户通过QQ授权方式登录了系统',
      text: `${info.nickname}刚刚登录了系统`,
    })
  }
  return info
}

export function generateToken(id: number): string {
  return encrypt.encode({
    id,
    expire: moment()
      .add(14, 'd')
      .valueOf(),
  })
}

export async function getUserInfo(
  access_token: string,
  openid: string
): Promise<any> {
  const { data } = await axios.get(
    `https://graph.qq.com/user/get_user_info?access_token=${access_token}&oauth_consumer_key=101454823&openid=${openid}`
  )
  if (data.ret < 0) {
    throw new BadRequest(data.msg, data)
  }
  return data
}

export async function getUnionID(access_token: string): Promise<string> {
  const { data } = await axios.get(
    `https://graph.qq.com/oauth2.0/me?access_token=${access_token}&unionid=1`
  )
  const parseData = eval(`function callback(val){return val} ${data}`)
  if (!parseData.unionid) {
    throw new BadRequest(parseData.error_description, parseData)
  }
  return parseData.unionid
}
