import { getUserFromCookie } from "lib/auth";
import { db } from "lib/db";

export const getTeams = async () => {
  const user = await getUserFromCookie();
  const teams = await db.team.findMany({
    where: {
      OR: [
        { createdBy: user?.id },
        { members: { some: { userId: user?.id } } },
      ],
    },
    include: {
      projects: {
        include: {
          tasks: true,
        },
      },
      members: {
        include: {
          user: true,
        },
      },
    },
  });

  return { teams };
};
