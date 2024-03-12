export type TokenUser = {
  sub: number
  email: string
}

export type TokenAccess = {
  accessToken: string
  refreshToken: string
}

export interface AuthRequest extends Request {
  user: TokenUser
  query: {
    code: string
  }
}
