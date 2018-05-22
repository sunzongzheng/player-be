export enum vendor {
  netease,
  qq,
  xiami,
}

export interface EmailOption {
  to: string
  subject: string
  text: string
}

export enum ErrorType {
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  SystemError = 500,
}

export type SessionMeta = {
  id: number
  expire?: number
}

export interface Session extends Express.Session {
  meta: SessionMeta
}
