import { Project, Task } from "@prisma/client";
import { format } from "date-fns";

export type ActivityType =
  | { id: string; type: "project-created"; name: string; date: Date }
  | { id: string; type: "task-created"; name: string; date: Date }
  | {
      id: string;
      type: "task-updated";
      name: string;
      status: string;
      date: Date;
    };

export function buildActivityList(
  projects: Project[],
  tasks: Task[]
): ActivityType[] {
  const projectActivities = projects.map((p) => ({
    id: p.id,
    type: "project-created" as const,
    name: p.name,
    date: p.createdAt,
  }));

  const taskCreations = tasks.map((t) => ({
    id: t.id,
    type: "task-created" as const,
    name: t.name,
    date: t.createdAt,
  }));

  const taskUpdates = tasks
    .filter((t) => t.updatedAt.getTime() !== t.createdAt.getTime())
    .map((t) => ({
      id: t.id,
      type: "task-updated" as const,
      name: t.name,
      status: t.status,
      date: t.updatedAt,
    }));

  return [...projectActivities, ...taskCreations, ...taskUpdates].sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );
}

export function formatDate(date: Date | undefined) {
  return date ? format(date, "PPP") : "Unknown";
}
