import { getUserFromCookie } from "@/lib/auth";
import React from "react";
import { format } from "date-fns";
import { db } from "@/lib/db";
import LogoutButton from "@/components/user/LogoutButton";
import TaskStatusChart from "@/components/user/TaskStatusChart";
import Card from "@/components/Card";
import GlassPane from "@/components/GlassPane";

export default async function Page() {
  const user = await getUserFromCookie();
  if (!user) return <div className="p-4">Not logged in</div>;

  // Get user with related projects and tasks
  const fullUser = await db.user.findUnique({
    where: { id: user.id },
    include: {
      projects: {
        where: { deleted: false },
        include: {
          tasks: true,
        },
      },
      tasks: true,
    },
  });

  const activityList = [
    // Project Creations
    ...(fullUser?.projects.map((project) => ({
      id: project.id,
      type: "project-created" as const,
      name: project.name,
      date: project.createdAt,
    })) || []),

    // Task Creations
    ...(fullUser?.tasks.map((task) => ({
      id: task.id,
      type: "task-created" as const,
      name: task.name,
      date: task.createdAt,
    })) || []),

    // Task Updates (status change)
    ...(fullUser?.tasks
      .filter((task) => task.updatedAt.getTime() !== task.createdAt.getTime())
      .map((task) => ({
        id: task.id,
        type: "task-updated" as const,
        name: task.name,
        status: task.status,
        date: task.updatedAt,
      })) || []),
  ];

  // Sort all events by `date` descending
  const sortedActivities = activityList.sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );

  const totalProjects = fullUser?.projects.length ?? 0;
  const totalTasks = fullUser?.tasks.length ?? 0;
  const completedTasks =
    fullUser?.tasks.filter((t) => t.status === "COMPLETED").length ?? 0;
  const startedTasks =
    fullUser?.tasks.filter((t) => t.status === "STARTED").length ?? 0;
  const notStartedTasks =
    fullUser?.tasks.filter((t) => t.status === "NOT_STARTED").length ?? 0;

  return (
    <div className="h-full overflow-y-auto pr-3 md:pr-3 w-full flex flex-col gap-3">
      {/* Profile Section */}
      <Card className="flex flex-col sm:flex-row justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-black capitalize">
            {fullUser?.firstName} {fullUser?.lastName}
          </h1>
          <p className="text-sm text-gray-500">Email: {fullUser?.email}</p>
          <p className="text-sm text-gray-500">
            Joined:{" "}
            {fullUser?.createdAt
              ? format(fullUser.createdAt, "PPP")
              : "Unknown"}
          </p>
        </div>
        <LogoutButton />
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatCard label="Projects" value={totalProjects} />
        <StatCard label="Tasks" value={totalTasks} />
        <TaskStatusChart
          completed={completedTasks}
          started={startedTasks}
          notStarted={notStartedTasks}
        />
      </div>

      {/* Recent Activity */}
      <GlassPane className="text-xl font-medium mb-2 rounded-3xl">
        <h1 className="p-2 px-8">Recent Activity</h1>
        <Card>
          <ul className="space-y-2 text-sm text-gray-700">
            {sortedActivities.slice(0, 10).map((item) => (
              <li key={`${item.type}-${item.id}`}>
                {item.type === "project-created" && (
                  <>
                    📁 <strong>{item.name}</strong> — <em>Project created</em>{" "}
                    on {format(item.date, "PPP")}
                  </>
                )}
                {item.type === "task-created" && (
                  <>
                    📝 <strong>{item.name}</strong> — <em>Task created</em> on{" "}
                    {format(item.date, "PPP")}
                  </>
                )}
                {item.type === "task-updated" && (
                  <>
                    🔄 <strong>{item.name}</strong> — <em>Status changed to</em>{" "}
                    <code>{item.status}</code> on {format(item.date, "PPP")}
                  </>
                )}
              </li>
            ))}
          </ul>
        </Card>
      </GlassPane>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card className="flex flex-col items-center justify-center p-4">
      <div className="text-3xl font-bold text-black">{value}</div>
      <div className="text-2xl text-gray-500">{label}</div>
    </Card>
  );
}
