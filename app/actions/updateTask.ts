"use server";

import { validateJWT } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function updateTask({
  id,
  projectId,
  name,
  description,
}: {
  id: string;
  projectId: string;
  name: string;
  description: string;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(process.env.COOKIE_NAME || "");

  const user = await validateJWT(token?.value || "");

  await db.task.update({
    where: { id, ownerId: user.id, projectId },
    data: { name, description },
  });

  revalidatePath(`/project/${projectId}`);
}
