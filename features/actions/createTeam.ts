"use server";
import { validateJWT } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { nanoid } from "nanoid";

export async function createTeam(name: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get(process.env.COOKIE_NAME || "");

  const user = await validateJWT(token?.value || "");
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
