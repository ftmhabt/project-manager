import { TasksWithProject } from "features/tasks/actions/getUserTasks";
import { isBetween } from "lib/dateHelpers";
import { useMemo } from "react";

export function useActiveItems(tasks: TasksWithProject, selectedDay?: Date) {
  return useMemo(() => {
    if (!selectedDay) return [];
    return tasks.filter(
      (task) => task.due && isBetween(selectedDay, task.createdAt, task.due)
    );
  }, [tasks, selectedDay]);
}
