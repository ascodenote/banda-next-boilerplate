import CredentialsProvider from 'next-auth/providers/credentials'
import { login, refreshToken } from '@/services/auth'

// interfaces for credentials

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export const authOptions = {
  // https://next-auth.js.org/configuration/providers
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'User', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error('Credentials not provided')
        }
        let loginResponse = await login({
          email: credentials.email,
          password: credentials.password,
        })
        // console.log("response Uhuyyyy", loginResponse.data)
        if (loginResponse.status === 201) {
          return {
            id: loginResponse.data.user.sub,
            status: 'success',
            data: loginResponse.data,
          }
        }
        

        throw new Error('Login failed')
      },
    }),
  ],
  session: {
    // Use JSON Web Tokens for session instead of database sessions.
    // This option can be used with or without a database for users/accounts.
    // Note: `strategy` should be set to 'jwt' if no database is used.
    strategy: 'jwt',
  },
  // You can define custom pages to override the built-in ones. These will be regular Next.js pages
  // so ensure that they are placed outside of the '/api' folder, e.g. signIn: '/auth/mycustom-signin'
  // The routes shown here are the default URLs that will be used when a custom
  // pages is not specified for that route.
  // https://next-auth.js.org/configuration/pages
  pages: {
    signIn: '/login',
    error: '/login', // Error code passed in query string as ?error=
    verifyRequest: '/login', // (used for check email message)
    signUp: '/signup',
  },
  // Callbacks are asynchronous functions you can use to control what happens
  // when an action is performed.
  // https://next-auth.js.org/configuration/callbacks
  callbacks: {
    async session(payload: any) {
      const { token } = payload
      
      // console.log("JWT Payload",payload)
      return {
        user: token.user.user, // Mengambil user dari token
        expires: token.exp, // Mengambil waktu kedaluwarsa dari token
        ...token,
      }
    },
    async jwt(payload: any) {
      const { token: tokenJWT, user: userJWT, account, trigger } = payload
      console.log("PAYLOAD",payload)
      console.log("Token IKI",tokenJWT)

    if (trigger === 'signIn' && account.type === 'credentials') {
      let user = userJWT.data.user
      let status = userJWT.status
      let tokenData = userJWT.data.backendTokens
      let token = {
        accessToken: tokenData.accessToken,
        refreshToken: tokenData.refreshToken,
        tokenExpires: tokenData.expiresIn,
      }
    try {
      return {
            token,
            user,
            status,
          }
    } catch (error) {
      throw new Error('Error setting up session');
    }
  }

      // TODO: check if the token expired and refresh token
      const shouldRefreshTime = Math.round(
        tokenJWT.token.tokenExpires - Date.now()
      )

      console.log("Check For Refersh",shouldRefreshTime)

      if (shouldRefreshTime < 0) {
        try {
          let payload = {}
          let headers = {
            'Content-Type': 'application/json',
            Authorization: tokenJWT.token.refreshToken,
          }

          let ResponseTokenRefresh = await refreshToken(payload, headers)
          console.log("Refersh Token",ResponseTokenRefresh)
          if (ResponseTokenRefresh.data.status === 'success') {
            let data = ResponseTokenRefresh.data.data
            console.log("Response Refersh",data)
            let token = {
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
              tokenExpires: data.expiresIn,
            }
            return {
              ...tokenJWT,
              token,
            }
          }
        } catch (error) {
          throw new Error('Token refresh failed')
        }
      }

      // ** pass the information to the session on normal invocation
      return { ...tokenJWT }
    },
  },
  jwt: {
    // A secret to use for key generation (you should set this explicitly)
    secret: process.env.NEXTAUTH_SECRET,
    // Set to true to use encryption (default: false)
    // encryption: true,
    // You can define your own encode/decode functions for signing and encryption
    // if you want to override the default behaviour.
    // encode: async ({ secret, token, maxAge }) => {},
    // decode: async ({ secret, token, maxAge }) => {},
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NEXTAUTH_DEBUG || false,
}
