import { db } from "./db";

export async function getFullUserWithProjectsAndTasks(userId: string) {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        tasks: {
          where: { deleted: false, ownerId: userId },
          include: { assignedTo: true, project: true },
        },
        assignedTasks: {
          where: { deleted: false, assignedToId: userId },
          include: { assignedTo: true, project: true },
        },
      },
    });
    if (!user) return null;

    const projects = await db.project.findMany({
      where: {
        deleted: false,
        OR: [
          { ownerId: userId },
          { team: { members: { some: { userId: userId } } } },
        ],
      },
      include: {
        team: { include: { members: true } },
        tasks: {
          where: { deleted: false },
          include: {
            assignedTo: true,
            project: true,
          },
        },
      },
    });

    const taskMap = new Map();
    [...user.tasks, ...user.assignedTasks].forEach((task) => {
      taskMap.set(task.id, task);
    });
    const allTasks = Array.from(taskMap.values());

    return { ...user, projects, tasks: allTasks };
  } catch (error) {
    console.error("Failed to fetch full user data:", error);
    throw new Error("Unable to fetch user data");
  }
}
