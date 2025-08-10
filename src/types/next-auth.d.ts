import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session extends DefaultSession {
    accessToken?: string
    refreshToken?: string
    stravaId?: number
  }

  interface Profile {
    id: number
    firstname: string
    lastname: string
    email: string
    profile: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string
    refreshToken?: string
    stravaId?: number
  }
}
