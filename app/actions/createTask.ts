"use server";
import { validateJWT } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function createTask({ name, description, projectId, due }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(process.env.COOKIE_NAME || "");

    const user = await validateJWT(token?.value || "");
    await db.task.create({
      data: {
        name,
        ownerId: user.id,
        projectId,
        description,
        due,
        status: "NOT_STARTED",
      },
    });
  } catch (error) {
    console.log(error);
  } finally {
    revalidatePath(`/project/${projectId}`);
  }
}
