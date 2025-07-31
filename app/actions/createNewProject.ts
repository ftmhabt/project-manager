"use server";
import { validateJWT } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function createNewProject(name: string, teamId?: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get(process.env.COOKIE_NAME || "");
  if (!token) throw new Error("Not authenticated");

  const user = await validateJWT(token?.value || "");

  // Create personal project
  if (!teamId) {
    const project = await db.project.create({
      data: { name: name, ownerId: user.id },
    });

    revalidatePath("/home");

    return project;
  }

  // Check if user is in team
  const member = await db.teamMember.findFirst({
    where: { teamId: teamId, userId: user.id },
  });
  if (!member) throw new Error("You are not a member of this team");

  const project = await db.project.create({
    data: { name: name, teamId: teamId },
  });

  revalidatePath("/team/" + teamId);

  return project;
}
