import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "@/auth.config";
import { login } from "./services/auth";

const { providers: authConfigProviders, ...authConfigRest } = authConfig;

async function loginToBackend(email: string, password: string) {
  const apiUrl = "http://10.10.100.126:6541/api/auth/login";

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data = await response.json();
    return data; // Return the response from the backend (token, user info, etc.)
  } catch (error) {
    throw new Error(`Error logging in: ${error.message}`);
  }
}

const nextAuth = NextAuth({
  ...authConfigRest,
  providers: [
    ...authConfigProviders,
    Credentials({
      async authorize(credentials) {
        if (!credentials) {
          throw new Error("Credentials not provided");
        }

        const { email, password } = credentials;

        try {
          // Attempt to log in to the backend
          const user = await loginToBackend(email, password);

          if (user) {
            return user; // Return user object on successful login
          } else {
            throw new Error("Login failed");
          }
        } catch (error) {
          throw new Error(`Login failed: ${error.message}`);
        }
      },
    }),
  ],
});

export const { signIn, signOut, auth, handlers } = nextAuth;
