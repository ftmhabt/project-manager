import { getProjectById } from "@/app/features/tasks/actions/getAllProjects";
import TaskCard from "@/app/features/tasks/components/TaskCard";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProjectById(id);

  return (
    <div className="h-full overflow-y-auto pr-3 md:pr-6 w-1/1">
      <TaskCard
        tasks={project?.tasks}
        title={project?.name || "Project"}
        projectId={project?.id}
        teamMembers={project?.team?.members || []}
        teamOwnerId={project?.team?.createdBy || ""}
      />
    </div>
  );
}
