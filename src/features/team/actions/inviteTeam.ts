"use server";
import { getUserFromCookie } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/dist/client/components/navigation";

export async function getTeamByInviteCodeAction(inviteCode: string) {
  return db.team.findUnique({
    where: { inviteCode },
    include: { members: true },
  });
}

export async function joinTeamAction(inviteCode: string) {
  const user = await getUserFromCookie();

  const dbUser = await db.user.findUnique({
    where: { id: user?.id },
  });

  if (!dbUser) throw new Error("User no longer exists");

  const team = await db.team.findUnique({ where: { inviteCode } });
  if (!team) throw new Error("Invalid code");

  const existing = await db.teamMember.findUnique({
    where: { teamId_userId: { teamId: team.id, userId: dbUser.id } },
  });

  if (!existing && team.createdBy !== user?.id) {
    await db.teamMember.create({
      data: { teamId: team.id, userId: dbUser.id, role: "MEMBER" },
    });
  }

  redirect(`/team/${team.id}`);
}
