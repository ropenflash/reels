// import type { NextAuthOptions } from "next-auth";

// types/next-auth.d.ts (or any global .d.ts file)
import type { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role?: "ADMIN" | "UPLOADER" | "VIEWER";
    };
  }

  interface User extends DefaultUser {
    id: string;
    role?: "ADMIN" | "UPLOADER" | "VIEWER";
  }
}
