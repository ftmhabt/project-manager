"use server";

import { TASK_STATUS } from "@/app/generated/prisma";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateTaskStatus({
  id,
  projectId,
  status,
}: {
  id: string;
  projectId: string;
  status: TASK_STATUS;
}) {
  await db.task.update({
    where: { id, projectId },
    data: { status },
  });
  revalidatePath(`/project/${projectId}`);
}
