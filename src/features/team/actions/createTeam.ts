"use server";

import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";
import { getUserFromCookie } from "lib/auth";
import { db } from "lib/db";

export async function createTeam(name: string) {
  const user = await getUserFromCookie();
  if (!user) throw new Error("Unauthorized");

  const inviteCode = nanoid(10);

  await db.team.create({
    data: {
      name,
      inviteCode,
      createdBy: user.id,
      members: {
        create: {
          userId: user.id,
          role: "OWNER",
        },
      },
    },
    include: { members: true },
  });

  revalidatePath("/team");
}
