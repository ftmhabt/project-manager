"use client";

import { useEffect, useState } from "react";
import { isSameDay, isSameWeek } from "date-fns";
import { getUserTasks } from "@/app/actions/getUserTasks";
import GlassPane from "../GlassPane";
import Card from "../Card";

type Task = {
  id: string;
  name: string;
  due: Date | null;
  status: "NOT_STARTED" | "STARTED" | "COMPLETED";
  project: {
    name: string;
  };
};

export default function Agenda({ selectedDate }: { selectedDate: Date }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      const data = await getUserTasks();
      setTasks(data);
      setLoading(false);
    };

    fetchTasks();
  }, [selectedDate]);

  const todayTasks = tasks.filter((task) =>
    task.due ? isSameDay(task.due, selectedDate) : false
  );

  const weekTasks = tasks.filter((task) =>
    task.due ? isSameWeek(task.due, selectedDate, { weekStartsOn: 0 }) : false
  );

  return (
    <GlassPane className="rounded-3xl sm:p-6 p-2 bg-violet-500 text-white flex flex-col h-full overflow-hidden">
      <h3 className="text-lg font-semibold pl-3 shrink-0 mb-3">Agenda</h3>

      {loading ? (
        <p className="text-sm pl-3">Loading...</p>
      ) : (
        <div className="flex flex-col flex-1 overflow-hidden gap-3">
          <div className="text-sm pl-3 shrink-0">
            {todayTasks.length > 0 ? (
              <p>
                📅 You have {todayTasks.length} task
                {todayTasks.length === 1 ? "" : "s"} due today.
              </p>
            ) : (
              <p>🎉 No tasks due today.</p>
            )}

            {weekTasks.length > 0 && (
              <p>
                📆 {weekTasks.length} task{weekTasks.length === 1 ? "" : "s"}{" "}
                due this week.
              </p>
            )}
          </div>
          <Card className="grid gap-4 rounded-2xl flex-1 overflow-hidden p-5 pt-4  text-xs">
            {todayTasks.length > 0 && (
              <div className="flex flex-col overflow-hidden">
                <h4 className="font-semibold text-gray-800 mb-1 shrink-0">
                  Due Today
                </h4>
                <ul className="space-y-2 overflow-y-auto overflow-x-hidden pr-1 flex-1">
                  {renderTaskList(todayTasks, "border-violet-500")}
                </ul>
              </div>
            )}
            {weekTasks.length > 0 && (
              <div className="flex flex-col overflow-hidden">
                <h4 className="font-semibold text-gray-800 mb-1 shrink-0">
                  Due This Week
                </h4>
                <ul className="space-y-2 overflow-y-auto pr-1 flex-1">
                  {renderTaskList(weekTasks, "border-violet-500", true)}
                </ul>
              </div>
            )}
          </Card>
        </div>
      )}
    </GlassPane>
  );
}

function renderTaskList(
  tasks: Task[],
  borderColor: string,
  showDueDate: boolean = false
) {
  const incompleteTasks = tasks.filter((t) => t.status !== "COMPLETED");
  const completedTasks = tasks.filter((t) => t.status === "COMPLETED");

  const renderTaskItem = (task: Task, isCompleted: boolean) => (
    <li
      key={task.id}
      className={`flex items-start gap-2 border-l-2 pl-2 text-black ${borderColor} ${
        isCompleted ? "opacity-60" : ""
      }`}
    >
      <div className="flex justify-between w-full">
        <div>
          <p className={`font-medium ${isCompleted ? "line-through" : ""}`}>
            {task.name}
          </p>
          <p className="text-xs text-gray-500">{task.project.name}</p>
        </div>

        {showDueDate && task.due && (
          <p className="text-xs text-gray-400">
            {task.due.toLocaleDateString()}
          </p>
        )}
      </div>
    </li>
  );

  return (
    <>
      {incompleteTasks.map((task) => renderTaskItem(task, false))}

      {completedTasks.length > 0 && (
        <>
          <hr className="my-2 border-t border-dashed border-gray-300" />
          {completedTasks.map((task) => renderTaskItem(task, true))}
        </>
      )}
    </>
  );
}
