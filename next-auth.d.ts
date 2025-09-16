import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    isadmin?: boolean;
    nickname?: string;
    passwd: string;
    outdt?: string;
    descript?: string;
  }

  interface Session {
    user: {
      //isadmin?: boolean;
      nickname: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    isadmin?: boolean;
  }
}
