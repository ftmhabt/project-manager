import { Task, TASK_STATUS } from "@/app/generated/prisma";
import GlassPane from "../../../../components/GlassPane";
import { format } from "date-fns";
import Link from "next/link";

export default function TaskList({
  tasks,
  selectedDay,
}: {
  tasks: Task[];
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
          <GlassPane className="p-3 rounded-2xl text-black">
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
            <div
              className={`text-sm ${
                task.status === TASK_STATUS.COMPLETED ? "opacity-60" : ""
              }`}
            >
              {format(task.createdAt, "PPP")} → {format(task.due!, "PPP")}
            </div>
          </GlassPane>
        </li>
      ))}
    </ul>
  );
}
