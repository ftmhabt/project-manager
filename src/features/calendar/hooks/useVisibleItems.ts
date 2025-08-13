import { TASK_STATUS } from "@prisma/client";
import { TasksWithProject } from "features/tasks/actions/getUserTasks";
import { useMemo } from "react";

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
