import { fetchPosts } from "@/lib/bsky/store-posts";
import { createTask } from "@/utils";
import { z } from "zod";

export type StorePostsPayload = z.infer<typeof StorePostsPayload>;
export const StorePostsPayload = z.object({
  actor: z.string(),
});

export const storePosts = createTask({
  name: "store-posts",
  schema: z.object({
    actor: z.string(),
  }),
  task: async ({ actor }) => {
    await fetchPosts(actor);

    return;
  },
});
