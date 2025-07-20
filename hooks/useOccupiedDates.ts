import { useMemo } from "react";
import { Task, TASK_STATUS } from "@/app/generated/prisma";
import { eachDayOfInterval, startOfDay } from "date-fns";

export function useOccupiedDates(tasks: Task[], showCompleted: boolean) {
  return useMemo(() => {
    const uniqueDates = tasks.flatMap((task) => {
      if (!task.due || task.due < task.createdAt) return [];
      if (!showCompleted && task.status === TASK_STATUS.COMPLETED) return [];

      return eachDayOfInterval({ start: task.createdAt, end: task.due }).map(
        (date) => startOfDay(date).toDateString()
      );
    });

    const deduped = [...new Set(uniqueDates)];
    return deduped.map((d) => new Date(d));
  }, [tasks, showCompleted]);
}
