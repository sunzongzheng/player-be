import { ValidationParamSchema } from 'express-validator/check'
import moment from 'moment'

const isUndefined = (value: any) => {
    return typeof value === 'undefined'
}

export const start_dt: ValidationParamSchema = {
    in: ['query'],
    custom: {
        options: value => {
            if (isUndefined(value)) {
                return true
            }
            if (moment(value).isValid()) {
                return true
            }
            return false
        },
        errorMessage: 'start_dt 格式错误',
    },
    trim: true,
}

export const end_dt = start_dt
