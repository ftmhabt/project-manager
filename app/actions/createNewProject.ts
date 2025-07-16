"use server";
import { validateJWT } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function createNewProject(name: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get(process.env.COOKIE_NAME || "");

  const user = await validateJWT(token?.value || "");
  await db.project.create({
    data: {
      name,
      ownerId: user.id,
    },
  });

  revalidatePath("/home");
}
