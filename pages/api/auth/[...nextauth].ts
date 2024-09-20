import { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

const Backend_URL = "http://localhost:3800/api";

async function refreshToken(token: JWT): Promise<JWT> {
    console.log(token.backendTokens.refreshToken);
    const res = await fetch(Backend_URL + "/v1/auth/refresh", {
        method: "POST",
        headers: {
            authorization: `Refresh ${token.backendTokens.refreshToken}`,
        },
    });

    const response = await res.json();

    if (!res.ok) { // Tambahkan pengecekan jika gagal
        console.log('Refresh token failed', response);
        throw new Error('Refresh token failed'); // Lempar error untuk menangani logout
    }

    return {
        ...token,
        backendTokens: response,
    };
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { // Ubah dari username ke email
          label: "Email",
          type: "text",
          placeholder: "jsmith@example.com", // Ubah placeholder sesuai email
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) return null; // Ubah dari username ke email
        const { email, password } = credentials; // Ubah dari username ke email
        const res = await fetch(Backend_URL + "/auth/login", {
          method: "POST",
          body: JSON.stringify({
            email, // Ubah dari username ke email
            password,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        
        if (res.status == 401) {
          console.log(res.statusText);
          return null;
        }
        const user = await res.json();
        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) return { ...token, ...user };

      // Cek apakah token perlu diperbarui
      const isTokenExpired = new Date().getTime() >= token.backendTokens.expiresIn;
      console.log('is invalid', isTokenExpired, token.backendTokens.expiresIn);

      if (!isTokenExpired) return token; // Kembalikan token jika masih valid

      console.log('trigger to refresh');
      try {
          return await refreshToken(token); // Hanya panggil refreshToken jika sudah kadaluarsa
      } catch (error) {
          console.log('Logging out due to refresh token failure');
          return { ...token, user: null }; // Logout jika refresh token gagal
      }
    },

    async session({ token, session }) {
      session.user = token.user;
      session.backendTokens = token.backendTokens;

      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export default handler; // Tambahkan ini