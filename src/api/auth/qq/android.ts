import express from '@libs/express'
import {
  qqAuthWrite,
  generateToken,
  getUserInfo,
  getUnionID,
} from '../../../libs/auth'
import axios from 'axios'
import { checkSchema, validationResult } from 'express-validator/check'

const router = express()

router.get(
  '/',
  checkSchema({
    access_token: {
      in: ['query'],
      isEmpty: {
        errorMessage: 'access_token不能为空',
        negated: true,
      },
    },
    openid: {
      in: ['query'],
      isEmpty: {
        errorMessage: 'openid不能为空',
        negated: true,
      },
    },
  }),
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    validationResult(req).throw()
    // 获取用户信息
    const userInfo = await getUserInfo(req.query.access_token, req.query.openid)
    // 获取unionID
    const unionid = await getUnionID(req.query.access_token)
    // 存储
    const info = await qqAuthWrite({
      sn: req.query.openid,
      unionid,
      nickname: userInfo.nickname,
      avatar: userInfo.figureurl_qq_2,
      sourceData: userInfo,
    })
    res.send({
      token: generateToken(info.id),
      nickname: info.nickname,
      avatar: info.avatar,
    })
  }
)

export default router
