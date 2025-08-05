import { getUserFromCookie } from "@/lib/auth";
import React from "react";
import { format } from "date-fns";
import { db } from "@/lib/db";
import LogoutButton from "@/app/features/user/components/LogoutButton";
import TaskStatusChart from "@/app/features/user/components/TaskStatusChart";
import Card from "@/components/Card";
import GlassPane from "@/components/GlassPane";
import { Edit, FolderPlus, PlusSquare } from "react-feather";

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
          <ul className="space-y-2 text-sm text-gray-700 flex flex-col gap-3">
            {sortedActivities.slice(0, 10).map((item) => (
              <li key={`${item.type}-${item.id}`} className="font-medium">
                {item.type === "project-created" && (
                  <div>
                    <FolderPlus
                      color="#8b5cf6"
                      size={15}
                      className="inline-block"
                    />{" "}
                    <strong>{item.name}</strong> — <em>Project created</em> on{" "}
                    {format(item.date, "PPP")}
                  </div>
                )}
                {item.type === "task-created" && (
                  <div>
                    <PlusSquare
                      color="#8b5cf6"
                      size={15}
                      className="inline-block"
                    />{" "}
                    <strong>{item.name}</strong> — <em>Task created</em> on{" "}
                    {format(item.date, "PPP")}
                  </div>
                )}
                {item.type === "task-updated" && (
                  <div>
                    <Edit color="#8b5cf6" size={15} className="inline-block" />{" "}
                    <strong>{item.name}</strong> — <em>Status changed to</em>{" "}
                    <code>{item.status}</code> on {format(item.date, "PPP")}
                  </div>
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
    <Card className="flex flex-col items-center justify-center p-4 relative">
      {label === "Tasks" ? (
        <svg
          fill="hsla(317, 89%, 70%, 1)"
          className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  w-2/3 sm:w-1/2 hidden sm:block"
          width="300px"
          height="300px"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          id="file"
        >
          <path d="M19.41,7,15,2.59A2,2,0,0,0,13.59,2H6A2,2,0,0,0,4,4V20a2,2,0,0,0,2,2H18a2,2,0,0,0,2-2V8.41A2,2,0,0,0,19.41,7Z"></path>
        </svg>
      ) : (
        <svg
          fill="#8b5cf6"
          className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  w-2/3 sm:w-1/2 hidden sm:block"
          width="300px"
          height="300px"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          id="folder"
        >
          <path d="M20,6H13.41L11,3.59A2,2,0,0,0,9.59,3H4A2,2,0,0,0,2,5V19a2,2,0,0,0,2,2H20a2,2,0,0,0,2-2V8A2,2,0,0,0,20,6Z"></path>
        </svg>
      )}

      <div className="text-3xl font-bold text-black sm:text-white">{value}</div>
      <div className="text-2xl text-gray-500 sm:text-white">{label}</div>
    </Card>
  );
}
