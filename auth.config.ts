import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { login } from "./services/auth";

export const authConfig = {
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/login",
    error: "/login", // Error code passed in query string as ?error=
    verifyRequest: "/login", // (used for check email message)
  },
  callbacks: {
    authorized({ auth, request }) {
      const { nextUrl } = request;

      // Define public and auth URLs
      const publicUrls = ["/about", "/contact"]; // Public routes
      const authUrls = ["/login", "/register"]; // Authentication routes

      const isLoggedIn = !!auth?.user; // Check if the user is logged in
      const currentUrl = nextUrl.pathname; // Current URL being accessed

      if (publicUrls.includes(currentUrl)) {
        return true;
      }

      if (isLoggedIn && authUrls.includes(currentUrl)) {
        // console.log("LOGIN LOGED");
        return Response.redirect(new URL("/", nextUrl));
      }

      if (!isLoggedIn) {
        return false;
      }

      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update") {
        return { ...token, ...session.user };
      }

      if (user?.id) token.id = user.id;
      if (user?.role) token.role = user.role;

      return token;
    },
    signIn({ user, account, profile }) {
      if (account?.provider === "credentials") {
        return true;
      }

      return false;
    },
    session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;

      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
