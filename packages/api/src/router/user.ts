import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { desc, eq } from "@senka/db";
import { Post, User } from "@senka/db/schema";

import { protectedProcedure, publicProcedure } from "../trpc";

export const userRouter = {
  graph: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.User.findMany({
      orderBy: desc(User.did),
      limit: 100,
    });
  }),
} satisfies TRPCRouterRecord;
