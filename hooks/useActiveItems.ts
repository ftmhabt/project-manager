import { useMemo } from "react";
import { isBetween } from "@/lib/dateHelpers";
import { TasksWithProject } from "@/app/features/tasks/actions/getUserTasks";

export function useActiveItems(tasks: TasksWithProject, selectedDay?: Date) {
  return useMemo(() => {
    if (!selectedDay) return [];
    return tasks.filter(
      (task) => task.due && isBetween(selectedDay, task.createdAt, task.due)
    );
  }, [tasks, selectedDay]);
}
