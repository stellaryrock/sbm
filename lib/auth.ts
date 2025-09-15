import NextAuth, { AuthError, type User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Kakao from "next-auth/providers/kakao";
import Naver from "next-auth/providers/naver";
import prisma from "./db";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers: [
    Google,
    Github,
    Kakao,
    Naver,
    Credentials({
      credentials: {
        email: {},
        passwd: {},
      },
      async authorize(credentials) {
        console.log("credentials>>", credentials);

        return { email: credentials.email, passwd: credentials.passwd } as User;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, profile, account }) {
      const isCredential = account?.provider === "credentials";
      console.log("🚀 ~ isCredential:", isCredential);
      console.log("🚀 ~ profile:", profile);
      console.log("🚀 ~ user:", user);
      const { email, name: nickname, image } = user;
      if (!email) return false;

      const mbr = await prisma.member.findUnique({ where: { email } });
      console.log("🚀 ~ mbr:", mbr);
      if (isCredential) {
        if (!mbr) throw new AuthError("NotExistsMember");
        // 암호 비교(compare) ==> 실패하면 오류!, 성공하면 로그인!
      } else {
        // SNS 자동가입!
        if (!mbr && nickname) {
          await prisma.member.create({
            data: { email, nickname, image },
          });
        }
      }

      return true;
    },

    async jwt({ token, user, trigger, account, session }) {
      console.log("🚀 ~ account:", account);
      const userData = trigger === "update" ? session : user;
      if (userData) {
        token.id = userData.id;
        token.email = userData.email;
        token.name = userData.name || userData.nickname;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id?.toString() || "";
        session.user.name = token.name;
        session.user.email = token.email as string;
      }
      return session;
    },
  },

  trustHost: true,
  jwt: { maxAge: 30 * 60 },
  pages: {
    signIn: "/sign",
    error: "/sign/error",
  },
  session: {
    strategy: "jwt",
  },
});
