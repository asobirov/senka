import type { AppRouter } from "@senka/api";
import { createTRPCClient, httpBatchLink, loggerLink } from "@trpc/client";
import superjson from "superjson";

const getBaseUrl = () => {
  return process.env.TRPC_BASE_URL ?? "http://localhost:3000";
};

export const api = createTRPCClient<AppRouter>({
  links: [
    loggerLink({
      enabled: (opts) =>
        process.env.NODE_ENV === "development" ||
        (opts.direction === "down" && opts.result instanceof Error),
      colorMode: "ansi",
    }),
    httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
      transformer: superjson,
      headers() {
        const headers = new Map<string, string>();
        headers.set("x-trpc-source", "scheduler");

        return Object.fromEntries(headers);
      },
    }),
  ],
});
