import type { NextAuthConfig } from "next-auth";


export const authConfig = {
  session: { strategy: "jwt" }, 
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/login",
    error: "/login", // Error code passed in query string as ?error=
    verifyRequest: "/login", // (used for check email message)
  },
  // callbacks: {
  //   authorized({ auth, request }) {
  //     const { nextUrl } = request;

  //     // Define public and auth URLs
  //     const publicUrls = ["/about", "/contact"]; // Public routes
  //     const authUrls = ["/login", "/register"]; // Authentication routes

  //     const isLoggedIn = !!auth?.user; // Check if the user is logged in
  //     const currentUrl = nextUrl.pathname; // Current URL being accessed

  //     if (publicUrls.includes(currentUrl)) {
  //       return true;
  //     }

  //     if (isLoggedIn && authUrls.includes(currentUrl)) {
  //       // console.log("LOGIN LOGED");
  //       return Response.redirect(new URL("/", nextUrl));
  //     }

  //     if (!isLoggedIn) {
  //       return false;
  //     }

  //     return true;
  //   },
  //   async jwt({ token, user, trigger,account, session }) {
  //     console.log("JWT",{ token, user, trigger,account, session })

  //     if (trigger === "signIn" && account?.type === "credentials") {
  //       let userData = user.user;
  //       let tokenData = user.backendTokens;

  //       let token = {
  //         accessToken: tokenData.accessToken,
  //         refreshToken: tokenData.refreshToken,
  //         tokenExpires: tokenData.expiresIn,
  //       };
  //       try {
  //         return {
  //           token,
  //           user:userData,
  //         };
  //       } catch (error) {
  //         throw new Error("Error setting up session");
  //       }
  //     } else if (Date.now() < token.token.tokenExpires) {
  //       return { ...token };
  //     }else {
  //       if (!token.token.refreshToken)
  //         throw new TypeError("Missing refresh_token");

  //       try {
  //         let payload = {};
  //         let headers = {
  //           "Content-Type": "application/json",
  //           Authorization: token.token.refreshToken,
  //         };

  //         let ResponseTokenRefresh = await refreshToken(payload, headers);

  //         if (ResponseTokenRefresh.status === 200) {
  //           let data = ResponseTokenRefresh.data;

  //           let tokenData = {
  //             ...token.token,
  //             accessToken: data.accessToken,
  //             tokenExpires: data.expiresIn,
  //           };
  //           return {
  //             ...token,
  //             tokenData,
  //           };
  //         }
  //       } catch (error) {
  //         throw new Error("Token refresh failed");
  //       }
  //     }

  //     return token;
  //   },
  //   signIn({ user, account, profile }) {
  //     if (account?.provider === "credentials") {
  //       return true;
  //     }

  //     return false;
  //   },
  //   session({ session, token }) {
  //     session.user.id = token.id;
  //     session.user.role = token.role;

  //     return session;
  //   },
  // },
  providers: [],
} satisfies NextAuthConfig;
