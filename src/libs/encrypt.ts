import jwt from 'jwt-simple'
import { SessionMeta } from '@types'
import config from 'config'
import { Unauthorized } from '../libs/error'

const secret: string = config.get('jwtKey')
export default {
  encode(s: SessionMeta): string {
    return jwt.encode(s, secret)
  },
  decode(t: string): SessionMeta {
    try {
      return jwt.decode(t, secret)
    } catch (e) {
      throw new Unauthorized('尚未登录')
    }
  },
}
