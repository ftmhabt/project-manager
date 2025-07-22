"use server";

import { validateJWT } from "@/lib/auth";
import { db } from "@/lib/db";
import { cookies } from "next/headers";

export async function getUserTasks() {
  const cookieStore = await cookies();
  const token = cookieStore.get(process.env.COOKIE_NAME || "");

  const user = await validateJWT(token?.value || "");
  const tasks = await db.task.findMany({
    where: {
      ownerId: user.id,
      deleted: false,
    },
    include: {
      project: true,
    },
  });

  return tasks;
}
