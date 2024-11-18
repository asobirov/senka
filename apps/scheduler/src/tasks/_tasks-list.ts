import { testTask } from "./test.task";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace GraphileWorker {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface Tasks extends TaskNameToPayloadMap {}
  }
}

// TODO: fix inference
interface TaskNameToPayloadMap {
  "test-task": never;
}

export const tasks = [testTask] as const;

type TasksList<T extends typeof tasks = typeof tasks> = Record<
  T[number]["name"],
  T[number]["task"]
>;

export const taskList = tasks.reduce<TasksList>(
  (acc, task) => Object.assign(acc, { [task.name]: task.task }),
  {} as TasksList,
);
