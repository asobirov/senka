import type { Runner } from "graphile-worker";
import { run } from "graphile-worker";

import { pool } from "@senka/db";

export let runner: Runner | null = null;

export const startWorker: typeof run = async (options) => {
  if (runner) {
    return runner;
  }

  runner = await run({
    pgPool: pool,
    ...options,
  });

  return runner;
};
