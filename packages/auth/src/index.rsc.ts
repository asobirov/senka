import { cache } from "react";
import NextAuth from "next-auth";

import { adapter } from ".";
import { authConfig } from "./config";

export type { Session } from "next-auth";

const {
  handlers,
  auth: defaultAuth,
  signIn,
  signOut,
} = NextAuth({
  adapter,
  ...authConfig,
});

/**
 * This is the main way to get session data for your RSCs.
 * This will de-duplicate all calls to next-auth's default `auth()` function and only call it once per request
 */
const auth = cache(defaultAuth);

export { handlers, auth, signIn, signOut };

export { isSecureContext } from "./config";
export { invalidateSessionToken, validateToken } from ".";
