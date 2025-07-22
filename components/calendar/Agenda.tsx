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
    <GlassPane className="rounded-3xl p-6 pastel-mesh text-white flex flex-col h-full overflow-hidden">
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
          <Card className="flex flex-col gap-4 rounded-2xl flex-1 overflow-hidden p-5 pt-4">
            {todayTasks.length > 0 && (
              <div className="flex flex-col overflow-hidden">
                <h4 className="font-semibold text-gray-800 mb-1 shrink-0">
                  Due Today
                </h4>
                <ul className="space-y-2 overflow-y-auto overflow-x-hidden pr-1 flex-1">
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
            {weekTasks.length > 0 && (
              <div className="flex flex-col overflow-hidden">
                <h4 className="font-semibold text-gray-800 mb-1 shrink-0">
                  Due This Week
                </h4>
                <ul className="space-y-2 overflow-y-auto pr-1 flex-1">
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
                          📆 {task.due?.toLocaleDateString()}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Card>
        </div>
      )}
    </GlassPane>
  );
}
