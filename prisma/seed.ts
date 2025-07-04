import { Project, TASK_STATUS } from "@/app/generated/prisma";
import { hashPassword } from "@/lib/auth";
import { db } from "@/lib/db";

const getRandomTaskStatus = () => {
  const stautses = [
    TASK_STATUS.COMPLETED,
    TASK_STATUS.NOT_STARTED,
    TASK_STATUS.STARTED,
  ];
  return stautses[Math.floor(Math.random() * stautses.length)];
};

async function main() {
  const user = await db.user.upsert({
    where: { email: "user@mail.com" },
    update: {},
    create: {
      email: "user@mail.com",
      firstName: "person",
      lastName: "user",
      password: await hashPassword("password"),
      projects: {
        create: new Array(5)
          .fill(1)
          .map((_, i) => ({ name: `project ${i}`, due: new Date(2022, 5, 5) })),
      },
    },
    include: {
      projects: true,
    },
  });

  const task = await Promise.all(
    user.projects.map((project: Project) =>
      db.task.createMany({
        data: new Array(10).fill(1).map((_, i) => ({
          name: `Task ${i}`,
          ownerId: user.id,
          projectId: project.id,
          description: `Everything describes Task ${i}`,
          status: getRandomTaskStatus(),
        })),
      })
    )
  );
  console.log({ user, task });
}

main()
  .then(async () => await db.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
