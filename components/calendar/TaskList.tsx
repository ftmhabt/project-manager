import { Task, TASK_STATUS } from "@/app/generated/prisma";
import GlassPane from "../GlassPane";
import { format } from "date-fns";

export default function TaskList({
  tasks,
  selectedDay,
}: {
  tasks: Task[];
  selectedDay?: Date;
}) {
  if (!selectedDay) return null;

  if (tasks.length === 0) {
    return <p className="text-gray-500">No items active on this day.</p>;
  }

  return (
    <ul className="mt-4 space-y-2">
      {tasks.map((task) => (
        <li key={task.id}>
          <GlassPane className="p-3 rounded-2xl text-purple-300">
            <div
              className={`font-medium ${
                task.status === TASK_STATUS.COMPLETED ? "line-through" : ""
              }`}
            >
              {task.name}
            </div>
            <div className="text-sm">
              {format(task.createdAt, "PPP")} → {format(task.due!, "PPP")}
            </div>
          </GlassPane>
        </li>
      ))}
    </ul>
  );
}
