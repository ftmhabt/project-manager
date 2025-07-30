"use server";
import { validateJWT } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/dist/client/components/navigation";
import { cookies } from "next/headers";

export async function getTeamByInviteCodeAction(inviteCode: string) {
  return db.team.findUnique({
    where: { inviteCode },
    include: { members: true },
  });
}

export async function joinTeamAction(inviteCode: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get(process.env.COOKIE_NAME || "");

  const user = await validateJWT(token?.value || "");

  const dbUser = await db.user.findUnique({
    where: { id: user.id },
  });

  if (!dbUser) throw new Error("User no longer exists");

  const team = await db.team.findUnique({ where: { inviteCode } });
  if (!team) throw new Error("Invalid code");

  if (team.createdBy === user.id) {
    throw new Error("You are the owner of this team");
  }

  const existing = await db.teamMember.findUnique({
    where: { teamId_userId: { teamId: team.id, userId: dbUser.id } },
  });
  if (existing) throw new Error("Already a member");

  const teamMember = await db.teamMember.create({
    data: { teamId: team.id, userId: dbUser.id, role: "MEMBER" },
  });

  redirect(`/team/${team.id}`);

  return teamMember;
}
