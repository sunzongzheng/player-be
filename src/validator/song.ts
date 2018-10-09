import { ValidationParamSchema, check } from 'express-validator/check'
import { isUndefined, isBoolean, isObject, isNull } from 'util'
import { isEqual } from 'lodash'

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
                if (isUndefined(item.id) || isUndefined(item.name)) {
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
export const dl: ValidationParamSchema = {
    in: ['body'],
    custom: {
        options: (value: any) => {
            if (isUndefined(value) || isNull(value)) {
                return true
            } else if (!isBoolean(value)) {
                return false
            }
            return true
        },
        errorMessage: 'dl格式错误',
    },
}
export const quality: ValidationParamSchema = {
    in: ['body'],
    custom: {
        options: (value: any) => {
            if (isUndefined(value) || isNull(value)) {
                return true
            } else if (!isObject(value)) {
                return false
            } else if (isEqual(Object.keys(value).sort(), ['192', '320', '999'].sort())) {
                return true
            } else {
                return false
            }
        },
        errorMessage: 'quality格式错误',
    },
}
export default {
    id,
    vendor,
    // commentId,
    name,
    album,
    artists,
    cp,
    dl,
    quality,
}
