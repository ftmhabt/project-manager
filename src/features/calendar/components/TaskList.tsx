import { Task, TASK_STATUS } from "@/app/generated/prisma";
import GlassPane from "../../../../components/GlassPane";
import { format } from "date-fns";
import Link from "next/link";
import { TasksWithProject } from "../../tasks/actions/getUserTasks";

export default function TaskList({
  tasks,
  selectedDay,
}: {
  tasks: TasksWithProject;
  selectedDay?: Date;
}) {
  if (!selectedDay) return null;

  if (tasks.length === 0) {
    return <p className="text-gray-500">No tasks active on this day.</p>;
  }

  return (
    <ul className="mt-4 space-y-2">
      {tasks.map((task) => (
        <li key={task.id}>
          <GlassPane className="p-3 rounded-2xl text-black flex justify-between">
            <Link
              href={"project/" + task.projectId}
              className={`font-medium ${
                task.status === TASK_STATUS.COMPLETED
                  ? "line-through opacity-60"
                  : ""
              }`}
            >
              {task.name}
            </Link>
            <div className="text-xs text-violet-500">
              {task.project.team?.name}
            </div>
            <div
              className={`text-sm ${
                task.status === TASK_STATUS.COMPLETED ? "opacity-60" : ""
              }`}
            >
              Due {format(task.due!, "PPP")}
            </div>
          </GlassPane>
        </li>
      ))}
    </ul>
  );
}
