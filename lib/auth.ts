import NextAuth, { type User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Kakao from "next-auth/providers/kakao";
import Naver from "next-auth/providers/naver";

export const {
  handlers: { GET, POST },
  auth,
  signOut,
  signIn,
} = NextAuth({
  providers: [
    Google,
    Github,
    Kakao,
    Naver,
    Credentials({
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "email@bookmark.com",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "password...",
        },
      },
      async authorize(credentials) {
        console.log("🚀 ~ authorize ~ credentials:", credentials);

        const sampleUser = {
          email: credentials.email,
          password: credentials.password,
        };

        return sampleUser as User;
      },
    }),
  ],
  secret: process.env.AUTH_SECRET as string,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign",
  },
  trustHost: true,
  jwt: {
    maxAge: 30 * 60,
  },
  callbacks: {
    signIn({ user, profile }) {
      console.log("🚀 ~ signIn ~ user:", user);
      console.log("🚀 ~ signIn ~ profile:", profile);
      return true;
    },
    jwt({ token, user }) {
      console.log("🚀 ~ jwt ~ user:", user);
      console.log("🚀 ~ jwt ~ token:", token);
      return token;
    },
    session({ session, token }) {
      console.log("🚀 ~ session ~ session:", session);
      console.log("🚀 ~ session ~ token:", token);
      return session;
    },
  },
});
