import NextAuth from "next-auth"; //  { type Session }
import { authConfig } from "@/auth.config";
// import { NextRequest } from "next/server";

export default NextAuth(authConfig).auth;

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
