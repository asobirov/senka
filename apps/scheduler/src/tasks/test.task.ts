import { createTask } from "@/utils";
import { api } from "@/utils/api";
import { z } from "zod";

export const testTask = createTask({
  name: "test-task",
  schema: z.object({}),
  task: async () => {
    const posts = await api.post.all.query();

    console.log(posts);

    return;
  },
});
