import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "@/auth.config";
import { login } from "./services/auth";

const { providers: authConfigProviders, ...authConfigRest } = authConfig;

async function loginToBackend(email: string, password: string) {
  const apiUrl = "http://192.168.0.140:6541/api/auth/login";

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
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Login failed: ${error.message}`);
    } else {
      throw new Error("Login failed: Unknown error");
    }
  }
}

const nextAuth = NextAuth({
  ...authConfigRest,
  providers: [
    ...authConfigProviders,
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log(credentials)
        if (!credentials) {
          throw new Error("Credentials not provided");
        }
        const { email, password } = credentials;
        console.log("data credentials",credentials

        )
        try {
          console.log("HIT BE");
          const user = await login({
            email,
            password
          });
          console.log(user.data);
          if (user) {
            return user; // Return user object on successful login
          } else {
            throw new Error("Login failed");
          }
        } catch (error: unknown) {
          if (error instanceof Error) {
            throw new Error(`Login failed: ${error.message}`);
          } else {
            throw new Error("Login failed: Unknown error");
          }
        }
      },
    }),
  ],
});

export const { signIn, signOut, auth, handlers } = nextAuth;
