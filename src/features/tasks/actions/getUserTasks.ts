"use server";

import { getUserFromCookie } from "lib/auth";
import { db } from "lib/db";

export async function getUserTasks() {
  const user = await getUserFromCookie();
  if (!user) return [];

  const tasks = await db.task.findMany({
    where: {
      deleted: false,
      OR: [{ ownerId: user.id }, { assignedToId: user.id }],
    },
    include: {
      project: {
        include: {
          team: {
            select: {
              name: true,
            },
          },
        },
      },
      assignedTo: true,
      owner: true,
    },
  });

  return tasks;
}

export type TasksWithProject = Awaited<ReturnType<typeof getUserTasks>>;
