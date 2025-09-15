import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    isadmin?: boolean;
    outdt?: string;
    descript?: string;
  }

  interface Session {
    user: {
      //isadmin?: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    isadmin?: boolean;
  }
}
