import { TASK_STATUS, MEMBER_ROLE } from "@/app/generated/prisma";
import { hashPassword } from "@/lib/auth";
import { db } from "@/lib/db";

const getRandomTaskStatus = () => {
  const statuses = [
    TASK_STATUS.COMPLETED,
    TASK_STATUS.NOT_STARTED,
    TASK_STATUS.STARTED,
  ];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

const USERS = [
  {
    email: "alice@mail.com",
    firstName: "Alice",
    lastName: "Johnson",
    password: "alice123",
  },
  {
    email: "bob@mail.com",
    firstName: "Bob",
    lastName: "Smith",
    password: "bob123",
  },
  {
    email: "charlie@mail.com",
    firstName: "Charlie",
    lastName: "Brown",
    password: "charlie123",
  },
];

const TEAMS = [
  { name: "Frontend Masters", inviteCode: "FRONT-123" },
  { name: "Marketing Ninjas", inviteCode: "MARK-456" },
];

const PROJECT_NAMES = [
  "Website Redesign",
  "Mobile App Development",
  "Marketing Campaign",
  "Internal Dashboard",
  "Customer Support Tool",
];

const TASK_NAMES = [
  "Setup project structure",
  "Design wireframes",
  "Implement authentication",
  "Integrate API",
  "Write unit tests",
  "Fix reported bugs",
  "Optimize performance",
  "Deploy to production",
  "Prepare documentation",
  "Team meeting",
];

async function main() {
  // users
  const createdUsers = [];
  for (const u of USERS) {
    const user = await db.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        ...u,
        password: await hashPassword(u.password),
      },
    });
    createdUsers.push(user);
  }

  // teams
  const [alice, bob, charlie] = createdUsers;

  const frontendTeam = await db.team.create({
    data: {
      name: TEAMS[0].name,
      inviteCode: TEAMS[0].inviteCode,
      createdBy: alice.id,
      members: {
        create: [
          { userId: alice.id, role: MEMBER_ROLE.OWNER },
          { userId: bob.id, role: MEMBER_ROLE.MEMBER },
        ],
      },
    },
  });

  const marketingTeam = await db.team.create({
    data: {
      name: TEAMS[1].name,
      inviteCode: TEAMS[1].inviteCode,
      createdBy: bob.id,
      members: {
        create: [
          { userId: bob.id, role: MEMBER_ROLE.OWNER },
          { userId: charlie.id, role: MEMBER_ROLE.MEMBER },
        ],
      },
    },
  });

  // projects
  const aliceProjects = await db.project.createManyAndReturn({
    data: PROJECT_NAMES.slice(0, 2).map((name, i) => ({
      name,
      description: `${name} for Alice`,
      due: new Date(2025, 7, 10 + i * 3),
      ownerId: alice.id,
    })),
  });

  const frontendProjects = await db.project.createManyAndReturn({
    data: PROJECT_NAMES.slice(2, 4).map((name, i) => ({
      name,
      description: `${name} for Frontend Masters team`,
      due: new Date(2025, 7, 15 + i * 4),
      teamId: frontendTeam.id,
    })),
  });

  const marketingProjects = await db.project.createManyAndReturn({
    data: [
      {
        name: PROJECT_NAMES[4],
        description: `Customer Support Tool for Marketing Ninjas`,
        due: new Date(2025, 7, 20),
        teamId: marketingTeam.id,
      },
    ],
  });

  const allProjects = [
    ...aliceProjects,
    ...frontendProjects,
    ...marketingProjects,
  ];

  // tasks
  for (const project of allProjects) {
    await Promise.all(
      TASK_NAMES.map((taskName, i) =>
        db.task.create({
          data: {
            name: taskName,
            ownerId: project.ownerId ?? alice.id,
            projectId: project.id,
            description: `Task: ${taskName} for ${project.name}`,
            status: getRandomTaskStatus(),
            due: new Date(2025, 7, 15 + i),
            assignedToId:
              i % 3 === 0 ? bob.id : i % 4 === 0 ? charlie.id : null,
          },
        })
      )
    );
  }

  console.log("seed completed");
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
