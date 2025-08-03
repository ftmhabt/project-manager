"use server";

import { getAuthenticatedUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

interface TaskData {
  id?: string;
  name: string;
  description: string;
  projectId: string;
  due?: Date;
  assignedToId?: string;
}

export async function saveTask(data: TaskData) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (data.id) {
    // UPDATE
    await db.task.update({
      where: { id: data.id },
      data: {
        name: data.name,
        description: data.description,
        projectId: data.projectId,
        due: data.due,
        assignedToId: data.assignedToId || null,
      },
    });
  } else {
    // CREATE
    await db.task.create({
      data: {
        ownerId: user.id,
        name: data.name,
        description: data.description,
        projectId: data.projectId,
        due: data.due,
        assignedToId: data.assignedToId || null,
        status: "NOT_STARTED",
      },
    });
  }
  revalidatePath(`/project/${data.projectId}`);
}
