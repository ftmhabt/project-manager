"use server";

import { getUserFromCookie } from "@/lib/auth";
import { db } from "@/lib/db";

export async function getUserTasks() {
  const user = await getUserFromCookie();
  const tasks = await db.task.findMany({
    where: {
      ownerId: user?.id,
      deleted: false,
    },
    include: {
      project: true,
    },
  });

  return tasks;
}

export type TasksWithProject = Awaited<ReturnType<typeof getUserTasks>>;
