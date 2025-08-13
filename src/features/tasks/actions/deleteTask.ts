"use server";

import { db } from "lib/db";
import { revalidatePath } from "next/cache";

export async function deleteTask({
  id,
  projectId,
}: {
  id: string;
  projectId: string;
}) {
  await db.task.delete({
    where: { id, projectId },
  });
  revalidatePath(`/project/${projectId}`);
}
