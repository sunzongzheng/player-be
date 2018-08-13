import { ValidationParamSchema } from 'express-validator/check'

const isUndefined = (value: any) => {
    return typeof value === 'undefined'
}

export const name: ValidationParamSchema = {
    in: ['body', 'params'],
    isEmpty: {
        errorMessage: '歌单名称不能为空',
        negated: true,
    },
    isLength: {
        options: { max: 20 },
        errorMessage: '歌单名称不得超过20个字符',
    },
    trim: true,
}

export const ids: ValidationParamSchema = {
    in: ['body'],
    isEmpty: {
        errorMessage: '歌曲ids不能为空',
        negated: true,
    },
    isArray: {
        errorMessage: 'ids必须为数组',
    },
}

export const collects: ValidationParamSchema = {
    in: ['body'],
    isEmpty: {
        errorMessage: 'collects不能为空',
        negated: true,
    },
    isArray: {
        errorMessage: 'collects必须为数组',
    },
    custom: {
        options: (collects: Array<{ id: Number; vendor: Schema.vendor }>) => {
            for (let item of collects) {
                if (isUndefined(item.id) || isUndefined(item.vendor)) {
                    return false
                }
            }
            return true
        },
        errorMessage: 'collects格式错误',
    },
}
