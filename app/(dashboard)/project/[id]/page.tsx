import TaskCard from "@/components/TaskCard";
import { getUserFromCookie } from "@/lib/auth";
import { db } from "@/lib/db";

const getData = async (id: string) => {
  const user = await getUserFromCookie();

  const project = await db.project.findFirst({
    where: {
      id,
      OR: [
        { ownerId: user?.id },
        { team: { members: { some: { userId: user?.id } } } },
      ],
    },
    include: { tasks: true, team: true },
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
      />
    </div>
  );
}
