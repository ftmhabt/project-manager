import { useMemo } from "react";
import { Task } from "@/app/generated/prisma";
import { isBetween } from "@/lib/dateHelpers";

export function useActiveItems(tasks: Task[], selectedDay?: Date) {
  return useMemo(() => {
    if (!selectedDay) return [];
    return tasks.filter(
      (task) => task.due && isBetween(selectedDay, task.createdAt, task.due)
    );
  }, [tasks, selectedDay]);
}
