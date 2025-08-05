import TaskCard from "@/app/features/tasks/components/TaskCard";
import { getUserFromCookie } from "@/lib/auth";
import { db } from "@/lib/db";

const getData = async (id: string) => {
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

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getData(id);

  return (
    <div className="h-full overflow-y-auto pr-3 md:pr-6 w-1/1">
      <TaskCard
        tasks={project?.tasks || []}
        title={project?.name || "Project"}
        projectId={project?.id}
        teamMembers={project?.team?.members || []}
      />
    </div>
  );
}
