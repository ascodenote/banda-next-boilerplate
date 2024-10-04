import NextAuth from 'next-auth'
import { AuthOptions } from 'next-auth'
import { authOptions } from './options'

const handler = NextAuth(authOptions as AuthOptions)

export { handler as GET, handler as POST }
