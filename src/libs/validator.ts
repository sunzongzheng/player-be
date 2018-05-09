import { checkSchema, validationResult } from "express-validator/check"

export const schema = checkSchema
export const validate = validationResult
