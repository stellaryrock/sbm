import { findMemberByEmail } from "@/app/sign/sign.action";
import { compare } from "bcryptjs";
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
        console.log("🚀 ~ authorize ~ credentials:", credentials);

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

      let mbr = await findMemberByEmail(email, isCredential);
      console.log("🚀 ~ mbr:", mbr);
      if (mbr?.emailcheck) {
        return `/sign/error?error=CheckEmail&email=${email}&emailcheck=${mbr.emailcheck}&emailType=${mbr.emailType}`;
      }

      if (isCredential) {
        if (!mbr) throw authError("Not Exists Member!", "EmailSignInError");
        if (mbr.outdt) throw authError("Withdrawed Member!", "AccessDenied");
        if (!mbr.passwd)
          throw authError("RegistedBySNS", "OAuthAccountNotLinked");

        const isValidPasswd = await compare(user.passwd ?? "", mbr.passwd);
        if (!isValidPasswd)
          throw authError("Invalid Password!", "CredentialsSignin");
      } else {
        // SNS 자동가입!
        if (!mbr) {
          mbr = await prisma.member.create({
            data: { email, nickname: nickname || "guest", image },
          });
        }
      }

      user.id = String(mbr.id);
      user.name = mbr.nickname;
      if (mbr.image) user.image = mbr.image;
      user.isadmin = mbr.isadmin;

      return true;
    },

    async jwt({ token, user, trigger, account, session }) {
      const userData = trigger === "update" ? session : user;
      if (userData) {
        token.id = userData.id;
        token.email = userData.email;
        token.name = userData.name || userData.nickname;
        token.image = userData.image;
        token.isadmin = userData.isadmin;

        if (account) {
          console.log("🚀 ~ jwt ~ account:", account);
          // accesstoken, id_token (jwt)
          token.accessToken = account?.access_token;
          token.accessTokenExpires =
            Date.now() + (account.expires_in ?? 0) * 1000;
          token.refreshToken = account.refresh_token;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id?.toString() || "";
        session.user.name = token.name;
        session.user.email = token.email as string;
        session.user.image = token.image as string;
        session.user.isadmin = token.isadmin;
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

function authError(message: string, type: AuthError["type"]) {
  const authError = new AuthError(message);
  authError.type = type as typeof authError.type;
  return authError;
}
