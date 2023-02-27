import { Request } from 'express'

export type AuthRequest = Partial<Request> & {
  user: {
    sub: string
    username: string
    refreshToken: string
  }
}
