import TaskCard from "@/components/TaskCard";
import { getUserFromCookie } from "@/lib/auth";
import { db } from "@/lib/db";

const getData = async (id: string) => {
  const user = await getUserFromCookie();

  const project = await db.project.findFirst({
    where: { id, ownerId: user?.id },
    include: { tasks: true },
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
    <div className="h-full overflow-y-auto pr-6 w-1/1">
      <TaskCard
        tasks={project?.tasks || []}
        title={project?.name || "Project"}
      />
    </div>
  );
}
