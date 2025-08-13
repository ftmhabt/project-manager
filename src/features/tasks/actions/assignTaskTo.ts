"use server";

import { db } from "lib/db";
import { revalidatePath } from "next/cache";

export async function assignTaskTo({
  id,
  projectId,
  selectedUserId,
}: {
  id: string;
  projectId: string;
  selectedUserId: string;
}) {
  await db.task.update({
    where: { id, projectId },
    data: { assignedToId: selectedUserId },
  });
  revalidatePath(`/project/${projectId}`);
}
