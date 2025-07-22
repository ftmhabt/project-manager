"use client";

import { useEffect, useState } from "react";
import { isSameDay, isSameWeek } from "date-fns";
import { getUserTasks } from "@/app/actions/getUserTasks";

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

  const getStatusIcon = (status: Task["status"]) => {
    switch (status) {
      case "NOT_STARTED":
        return "⚪";
      case "STARTED":
        return "🟡";
      case "COMPLETED":
        return "✅";
      default:
        return "❓";
    }
  };

  return (
    <div className=" px-6">
      <h3 className="text-lg font-semibold text-purple-900">Agenda</h3>

      {loading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : (
        <div className="text-sm text-gray-700">
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
              📆 {weekTasks.length} task{weekTasks.length === 1 ? "" : "s"} due
              this week.
            </p>
          )}
          <div className="grid grid-cols-2">
            {weekTasks.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">
                  Due This Week
                </h4>
                <ul className="space-y-2 h-[80px] overflow-y-auto ">
                  {weekTasks.map((task) => (
                    <li
                      key={task.id}
                      className="flex items-start gap-2 border-l-2 pl-2 border-blue-400"
                    >
                      <span>{getStatusIcon(task.status)}</span>
                      <div>
                        <p className="font-medium">{task.name}</p>
                        <p className="text-xs text-gray-500">
                          📁 {task.project.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          📆 Due: {task.due?.toLocaleDateString()}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {todayTasks.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Due Today</h4>
                <ul className="mt-3 space-y-2 h-[80px] overflow-y-auto ">
                  {todayTasks.map((task) => (
                    <li
                      key={task.id}
                      className="flex items-start gap-2 border-l-2 pl-2 border-purple-400"
                    >
                      <span>{getStatusIcon(task.status)}</span>
                      <div>
                        <p className="font-medium">{task.name}</p>
                        <p className="text-xs text-gray-500">
                          📁 {task.project.name}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
