import { useMemo } from "react";
import { Task, TASK_STATUS } from "@/app/generated/prisma";

export function useVisibleItems(tasks: Task[], showCompleted: boolean) {
  return useMemo(() => {
    return tasks.filter(
      (task) => showCompleted || task.status !== TASK_STATUS.COMPLETED
    );
  }, [tasks, showCompleted]);
}
