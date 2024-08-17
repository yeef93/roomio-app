import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
          const res = await fetch(`${apiUrl}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              usernameOrEmail: credentials?.email,
              password: credentials?.password,
            }),
          });

          if (res.ok) {
            const user = await res.json();
            return {
              ...user,
              token: user.token,
              email: credentials?.email,
              scope: user.scope,
              sub: user.sub,
            };
          } else {
            throw new Error("Invalid credentials");
          }
        } catch (error) {
          console.error("Authentication failed:", error);
          throw new Error("Authentication failed");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.token = user.token;
        token.username = user.username;
        token.scope = user.scope;
        token.sub = user.sub;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.email = token.email as string;
      session.user.token = token.token as string;
      session.user.username = token.username as string;
      session.user.scope = token.scope as string;
      session.user.sub = token.sub as string;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
