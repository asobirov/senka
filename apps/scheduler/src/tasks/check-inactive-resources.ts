import { addJob, createTask } from "@/utils";
import { z } from "zod";

import { db } from "@senka/db/client";

export type StoreActorProfilePayload = z.infer<typeof StoreActorProfilePayload>;
export const StoreActorProfilePayload = z.object({
  actor: z.string(),
});

export const checkInactiveResources = createTask({
  name: "check-inactive-resources",
  schema: z.object({}),
  task: async () => {
    // get all users with parsedAt = null
    const users = await db.query.User.findMany({
      where: (User, { isNull }) => isNull(User.parsedAt),
      limit: 20
    });

    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      if (!user) {
        continue;
      }

      await addJob({
        name: "store-actor-profile",
        payload: { actor: user.did },
        options: {
          jobKey: `store-actor-profile:${user.did}`,
          maxAttempts: 5,
          runAt: new Date(Date.now() + i * 1 * 60 * 1000),
        },
      });
    }
  },
});
