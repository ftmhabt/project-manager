import React from "react";
import { getUserFromCookie } from "@/lib/auth";
import { getFullUserWithProjectsAndTasks } from "@/lib/user";
import Card from "@/components/Card";
import GlassPane from "@/components/GlassPane";
import LogoutButton from "@/app/features/user/components/LogoutButton";
import TaskStatusChart from "@/app/features/user/components/TaskStatusChart";
import { Edit, FolderPlus, PlusSquare } from "react-feather";
import {
  buildActivityList,
  formatDate,
} from "@/app/features/user/utils/activity";
import StatCard from "@/app/features/user/components/StatCard";

export default async function DashboardPage() {
  try {
    const user = await getUserFromCookie();
    if (!user) return <div className="p-4">Not logged in</div>;

    const fullUser = await getFullUserWithProjectsAndTasks(user.id);
    if (!fullUser) return <div className="p-4">User not found</div>;

    const activities = buildActivityList(fullUser.projects, fullUser.tasks);

    const totalProjects = fullUser.projects.length;
    const totalTasks = fullUser.tasks.length;
    const completedTasks = fullUser.tasks.filter(
      (t) => t.status === "COMPLETED"
    ).length;
    const startedTasks = fullUser.tasks.filter(
      (t) => t.status === "STARTED"
    ).length;
    const notStartedTasks = fullUser.tasks.filter(
      (t) => t.status === "NOT_STARTED"
    ).length;

    return (
      <div className="h-full overflow-y-auto pr-3 w-full flex flex-col gap-3">
        {/* Profile */}
        <Card className="flex flex-col sm:flex-row justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold capitalize text-black">
              {fullUser.firstName} {fullUser.lastName}
            </h1>
            <p className="text-sm text-gray-500">Email: {fullUser.email}</p>
            <p className="text-sm text-gray-500">
              Joined: {formatDate(fullUser.createdAt)}
            </p>
          </div>
          <LogoutButton />
        </Card>

        {/* Stats */}
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
              {activities.slice(0, 10).map((item) => (
                <li key={`${item.type}-${item.id}`} className="font-medium">
                  {item.type === "project-created" && (
                    <ActivityItem
                      icon={<FolderPlus color="#8b5cf6" size={15} />}
                      label="Project created"
                      {...item}
                    />
                  )}
                  {item.type === "task-created" && (
                    <ActivityItem
                      icon={<PlusSquare color="#8b5cf6" size={15} />}
                      label="Task created"
                      {...item}
                    />
                  )}
                  {item.type === "task-updated" && (
                    <ActivityItem
                      icon={<Edit color="#8b5cf6" size={15} />}
                      label={`Status changed to ${item.status}`}
                      {...item}
                    />
                  )}
                </li>
              ))}
            </ul>
          </Card>
        </GlassPane>
      </div>
    );
  } catch (error) {
    console.error("Error loading dashboard:", error);
    return (
      <div className="p-4">Something went wrong. Please try again later.</div>
    );
  }
}

function ActivityItem({
  icon,
  name,
  label,
  date,
}: {
  icon: React.ReactNode;
  name: string;
  label: string;
  date: Date;
}) {
  return (
    <div>
      {icon} <strong>{name}</strong> — <em>{label}</em> on {formatDate(date)}
    </div>
  );
}
