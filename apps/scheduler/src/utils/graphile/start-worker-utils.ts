import type { WorkerUtils, WorkerUtilsOptions } from "graphile-worker";
import { pool } from "@senka/db";
import { makeWorkerUtils } from "graphile-worker";

export let workerUtils: WorkerUtils | null = null;

export const startWorkerUtils = async (
  opts: WorkerUtilsOptions = {},
): Promise<WorkerUtils> => {
  if (workerUtils) {
    return workerUtils;
  }

  workerUtils = await makeWorkerUtils({
    pgPool: pool,
    ...opts,
  });

  return workerUtils;
};
