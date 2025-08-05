"use server";
import { getUserFromCookie } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createNewProject(name: string, teamId?: string) {
  const user = await getUserFromCookie();

  // Create personal project
  if (!teamId) {
    const project = await db.project.create({
      data: { name: name, ownerId: user?.id },
    });

    revalidatePath("/home");

    return project;
  }

  // Check if user is in team
  const member = await db.teamMember.findFirst({
    where: { teamId: teamId, userId: user?.id },
  });
  if (!member) throw new Error("You are not a member of this team");

  const project = await db.project.create({
    data: { name: name, teamId: teamId },
  });

  revalidatePath("/team/" + teamId);

  return project;
}
