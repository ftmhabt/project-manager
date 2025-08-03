"use server";

import { getAuthenticatedUser } from "@/lib/auth";
import { db } from "@/lib/db";

export const getAllProjects = async () => {
  const user = await getAuthenticatedUser();

  const projects = await db.project.findMany({
    where: {
      OR: [
        { ownerId: user?.id }, // Projects the user owns
        {
          team: {
            members: {
              some: { userId: user?.id }, // Projects from teams where user is a member
            },
          },
        },
      ],
    },
    select: {
      id: true,
      name: true,
    },
  });

  return projects;
};
