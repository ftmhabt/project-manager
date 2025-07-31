import { FC } from "react";
import Card from "./Card";
import clsx from "clsx";
import { Project, Task, Team } from "@/app/generated/prisma";

type ProjectWithTasksAndTeam = Project & {
  tasks: Task[];
  team?: Team | null;
};

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-us", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const ProjectCard: FC<{ project: ProjectWithTasksAndTeam }> = ({ project }) => {
  const completedCount = project.tasks.filter(
    (t) => t.status === "COMPLETED"
  ).length;

  const progress = Math.ceil((completedCount / project.tasks.length) * 100);

  return (
    <Card className="px-6 py-8 hover:scale-105 transition-all ease-in-out duration-200">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-300">
          {formatDate(project.createdAt)}
        </span>
        {project.team && (
          <span className="text-xs text-violet-500">
            Team: {project.team.name}
          </span>
        )}
      </div>
      <div className="mb-6">
        <span className="text-3xl text-gray-600">{project.name}</span>
      </div>
      <div className="mb-2">
        <span className="text-gray-400">
          {completedCount}/{project.tasks.length} completed
        </span>
      </div>
      <div className="w-full h-2 bg-violet-200 rounded-full mb-2">
        <div
          className={clsx(
            "h-full text-center text-xs text-white bg-violet-600 rounded-full"
          )}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="text-right">
        <span className="text-sm text-gray-600 font-semibold">{progress}%</span>
      </div>
    </Card>
  );
};

export default ProjectCard;
