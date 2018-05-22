import { ValidationParamSchema, check } from 'express-validator/check'

export const id: ValidationParamSchema = {
  in: ['body'],
  isEmpty: {
    errorMessage: '歌曲ID不能为空',
    negated: true,
  },
}
export const vendor: ValidationParamSchema = {
  in: ['body'],
  isEmpty: {
    errorMessage: '歌曲vendor不能为空',
    negated: true,
  },
  isIn: {
    options: [['qq', 'xiami', 'netease']],
    errorMessage: 'vendor错误',
  },
}
export const commentId: ValidationParamSchema = {
  in: ['body'],
  isEmpty: {
    errorMessage: 'commentId不能为空',
    negated: true,
  },
}
export const name: ValidationParamSchema = {
  in: ['body'],
  isEmpty: {
    errorMessage: '歌曲名称不能为空',
    negated: true,
  },
}
export const album: ValidationParamSchema = {
  in: ['body'],
  custom: {
    options: (value: any) => {
      if (!value.id || !value.name || !value.cover) {
        return false
      }
      return true
    },
    errorMessage: 'album格式错误',
  },
}
export const artists: ValidationParamSchema = {
  in: ['body'],
  isArray: {
    errorMessage: 'artists格式错误',
  },
  custom: {
    options: (value: any, { req }) => {
      for (let item of value) {
        if (!item.id || !item.name) {
          return false
        }
      }
      return true
    },
    errorMessage: 'artists格式错误',
  },
}
export const cp: ValidationParamSchema = {
  in: ['body'],
  isBoolean: {
    errorMessage: 'cp格式错误',
  },
}
export default {
  id,
  vendor,
  commentId,
  name,
  album,
  artists,
  cp,
}
