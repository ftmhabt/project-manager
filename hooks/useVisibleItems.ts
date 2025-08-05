import { useMemo } from "react";
import { TASK_STATUS } from "@/app/generated/prisma";
import { TasksWithProject } from "@/app/features/tasks/actions/getUserTasks";

export function useVisibleItems(
  tasks: TasksWithProject,
  showCompleted: boolean
) {
  return useMemo(() => {
    return tasks.filter(
      (task) => showCompleted || task.status !== TASK_STATUS.COMPLETED
    );
  }, [tasks, showCompleted]);
}
