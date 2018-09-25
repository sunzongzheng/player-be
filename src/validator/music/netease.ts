import { ValidationParamSchema } from 'express-validator/check'
import { isUndefined } from 'util'

// 排行榜ids
export const rankIds: ValidationParamSchema = {
    in: ['query'],
    isEmpty: {
        errorMessage: '排行榜ids不能为空',
        negated: true,
    },
    isArray: {
        errorMessage: 'ids必须为数组',
    },
    custom: {
        options: (ids: any[]) => {
            for (let id of ids) {
                const _id = Number(id)
                if (isNaN(_id) || _id < 0 || _id > 21) {
                    return false
                }
            }
            return true
        },
        errorMessage: 'ids格式错误',
    },
}

// limit
export const limit: ValidationParamSchema = {
    in: ['query'],
    custom: {
        options: value => {
            if (isUndefined(value)) return true
            const limit = Number(value)
            if (isNaN(limit) || limit < 0) {
                return false
            }
            return true
        },
        errorMessage: 'limit错误',
    },
}
