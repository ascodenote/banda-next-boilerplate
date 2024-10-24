import CredentialsProvider from "next-auth/providers/credentials";
import { login, refreshToken } from "@/services/auth";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "User", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error("Credentials not provided");
        }
        let loginResponse = await login({
          email: credentials.email,
          password: credentials.password,
        });
        console.log(loginResponse.data);
        if (loginResponse.status === 201) {
          return {
            id: loginResponse.data.user.sub,
            status: "success",
            data: loginResponse.data,
          };
        }

        throw new Error("Login failed");
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 1 * 60 * 60,
  },
  pages: {
    signIn: "/login",
    error: "/login", // Error code passed in query string as ?error=
    verifyRequest: "/login", // (used for check email message)
  },
  callbacks: {
    async jwt(payload: any) {
      const { token: tokenJWT, user: userJWT, account, trigger } = payload;
      // console.log("JWT FUNTION :", payload);

      if (trigger === "signIn" && account.type === "credentials") {
        let user = userJWT.data.user;
        let status = userJWT.status;
        let tokenData = userJWT.data.backendTokens;

        let token = {
          accessToken: tokenData.accessToken,
          refreshToken: tokenData.refreshToken,
          tokenExpires: tokenData.expiresIn,
        };
        try {
          return {
            token,
            user,
            status,
          };
        } catch (error) {
          throw new Error("Error setting up session");
        }
      } else if (Date.now() < tokenJWT.token.tokenExpires) {
        return { ...tokenJWT };
      } else {
        if (!tokenJWT.token.refreshToken)
          throw new TypeError("Missing refresh_token");

        try {
          let payload = {};
          let headers = {
            "Content-Type": "application/json",
            Authorization: tokenJWT.token.refreshToken,
          };

          let ResponseTokenRefresh = await refreshToken(payload, headers);

          if (ResponseTokenRefresh.status === 200) {
            let data = ResponseTokenRefresh.data;

            let token = {
              ...tokenJWT.token,
              accessToken: data.accessToken,
              tokenExpires: data.expiresIn,
            };
            return {
              ...tokenJWT,
              token,
            };
          }
        } catch (error) {
          throw new Error("Token refresh failed");
        }
      }
    },
    async session({ token, session }) {
      // console.log("Token awal",token)
      session.user = token.user;
      session.token = token.token;
      session.expires = new Date(session.token.tokenExpires).toISOString();
      console.log("session awal", session);
      return session;
    },
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  secret: process.env.NEXTAUTH_SECRET,
  // debug: process.env.NEXTAUTH_DEBUG || false,
};
