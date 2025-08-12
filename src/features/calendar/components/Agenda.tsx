"use client";

import { isSameDay, isSameWeek } from "date-fns";
import GlassPane from "../../../../components/GlassPane";
import Card from "../../../../components/Card";
import Link from "next/link";
import { TasksWithProject } from "@/app/features/tasks/actions/getUserTasks";
import { Calendar, Coffee } from "react-feather";

type AgendaTask = {
  id: string;
  name: string;
  due: Date | null;
  status: "NOT_STARTED" | "STARTED" | "COMPLETED";
  project: {
    name: string;
    id: string;
  };
};

export default function Agenda({
  tasks,
  selectedDate,
}: {
  tasks: TasksWithProject;
  selectedDate: Date;
}) {
  const todayTasks = tasks.filter((task) =>
    task.due ? isSameDay(task.due, selectedDate) : false
  );

  const weekTasks = tasks.filter((task) =>
    task.due ? isSameWeek(task.due, selectedDate, { weekStartsOn: 0 }) : false
  );

  return (
    <GlassPane className="rounded-3xl sm:p-6 p-2 bg-violet-500 text-white flex flex-col h-full overflow-hidden">
      <h3 className="text-lg font-semibold pl-3 shrink-0 mb-1 sm:mb-3">
        Agenda
      </h3>

      <div className="flex flex-col flex-1 overflow-hidden gap-1 sm:gap-3">
        <div className="text-sm pl-3 shrink-0">
          {todayTasks.length > 0 ? (
            <p>
              <Calendar size={14} className="inline-block" /> You have{" "}
              {todayTasks.length} task
              {todayTasks.length === 1 ? "" : "s"} due today.
            </p>
          ) : (
            <p>
              <Coffee size={14} className="inline-block" /> You have{" "}
              {todayTasks.length === 0 ? "no" : todayTasks.length} tasks due
              today.
            </p>
          )}

          {weekTasks.length > 0 && (
            <p>
              <Calendar size={14} className="inline-block" /> You have{" "}
              {weekTasks.length} task
              {weekTasks.length === 1 ? "" : "s"} due this week.
            </p>
          )}
        </div>
        <Card
          className={`flex gap-4 rounded-2xl flex-1 overflow-hidden sm:p-5 sm:pt-4 p-2 text-xs ${
            todayTasks.length === 0 && weekTasks.length === 0 ? "hidden" : ""
          }`}
        >
          <div className="flex flex-col flex-1 overflow-y-auto">
            {todayTasks.length > 0 && (
              <div className="flex flex-col mb-1">
                <h4 className="font-semibold text-gray-800 mb-1 shrink-0">
                  Due Today
                </h4>
                <ul className="space-y-2 overflow-y-auto pr-1 flex-1">
                  {renderTaskList(todayTasks, "border-violet-500")}
                </ul>
              </div>
            )}
            {weekTasks.length > 0 && (
              <div className="flex flex-col">
                <h4 className="font-semibold text-gray-800 mb-1 shrink-0">
                  Due This Week
                </h4>
                <ul className="space-y-2 pr-1">
                  {renderTaskList(weekTasks, "border-violet-500", true)}
                </ul>
              </div>
            )}
          </div>
        </Card>
      </div>
    </GlassPane>
  );
}

function renderTaskList(
  tasks: AgendaTask[],
  borderColor: string,
  showDueDate: boolean = false
) {
  const incompleteTasks = tasks.filter((t) => t.status !== "COMPLETED");
  const completedTasks = tasks.filter((t) => t.status === "COMPLETED");

  const renderTaskItem = (task: AgendaTask, isCompleted: boolean) => (
    <li
      key={task.id}
      className={`flex items-start gap-2 border-l-2 pl-2 text-black ${borderColor} ${
        isCompleted ? "opacity-60" : ""
      }`}
    >
      <Link
        href={"project/" + task.project.id}
        className="flex justify-between w-full"
      >
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
      </Link>
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
