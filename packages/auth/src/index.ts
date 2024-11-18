import type { Session as NextAuthSession } from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";

import { db } from "@acme/db/client";
import { Account, Session, User } from "@acme/db/schema";

import { authConfig } from "./config";

export type { Session } from "next-auth";

export const adapter = DrizzleAdapter(db, {
  usersTable: User,
  accountsTable: Account,
  sessionsTable: Session,
});

export const validateToken = async (
  token: string,
): Promise<NextAuthSession | null> => {
  const sessionToken = token.slice("Bearer ".length);
  const session = await adapter.getSessionAndUser?.(sessionToken);
  return session
    ? {
        user: {
          ...session.user,
        },
        expires: session.session.expires.toISOString(),
      }
    : null;
};

export const invalidateSessionToken = async (token: string) => {
  const sessionToken = token.slice("Bearer ".length);
  await adapter.deleteSession?.(sessionToken);
};

const { handlers, auth, signIn, signOut } = NextAuth({
  adapter,
  ...authConfig,
});

export { handlers, auth, signIn, signOut };

export { isSecureContext, authConfig } from "./config";
