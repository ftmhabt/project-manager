"use server";

import { TASK_STATUS } from "@prisma/client";
import { getUserFromCookie } from "lib/auth";
import { db } from "lib/db";

export const getAllProjects = async () => {
  const user = await getUserFromCookie();

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
    include: {
      tasks: {
        include: {
          assignedTo: { select: { id: true, firstName: true, lastName: true } },
        },
      },
      team: {
        include: {
          members: {
            include: {
              user: { select: { id: true, firstName: true, lastName: true } },
            },
          },
        },
      },
    },
  });

  return projects;
};
export type ProjectWithTasksAndTeams = Awaited<
  ReturnType<typeof getAllProjects>
>;

export const getProjectById = async (id: string) => {
  const user = await getUserFromCookie();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const project = await db.project.findFirst({
    where: {
      id,
      OR: [
        { ownerId: user?.id },
        { team: { members: { some: { userId: user?.id } } } },
      ],
    },
    include: {
      tasks: {
        include: {
          assignedTo: { select: { id: true, firstName: true, lastName: true } },
        },
      },
      team: {
        include: {
          members: {
            include: {
              user: { select: { id: true, firstName: true, lastName: true } },
            },
          },
        },
      },
    },
  });

  return project;
};
export type ProjectWithTasks = Awaited<ReturnType<typeof getProjectById>>;

export const getPriortyTasks = async (numbers: number) => {
  const user = await getUserFromCookie();
  const tasks = await db.task.findMany({
    where: {
      OR: [{ ownerId: user?.id }, { assignedToId: user?.id }],
      NOT: {
        status: TASK_STATUS.COMPLETED,
        deleted: false,
      },
    },
    take: numbers,
    orderBy: {
      due: "asc",
    },
  });

  return tasks;
};
