import { isUndefined, isArray } from 'util'
import { ValidationParamSchema } from 'express-validator/check'

// 排行榜ids
export const rankIds: ValidationParamSchema = {
    in: ['query'],
    custom: {
        options: (ids: any) => {
            if (isUndefined(ids)) {
                return true
            } else if (isArray(ids)) {
                for (let id of ids) {
                    const _id = Number(id)
                    if (isNaN(_id)) {
                        return false
                    }
                }
                return true
            } else {
                return false
            }
        },
        errorMessage: 'ids格式错误',
    },
}
