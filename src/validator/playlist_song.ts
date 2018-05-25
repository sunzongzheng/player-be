import { ValidationParamSchema, check } from 'express-validator/check'

export const id: ValidationParamSchema = {
    in: ['query'],
    isEmpty: {
        errorMessage: '收藏ID不能为空',
        negated: true,
    },
}
