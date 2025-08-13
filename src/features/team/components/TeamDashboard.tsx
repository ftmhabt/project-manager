"use client";
import { Project, Task, Team, TeamMember, User } from "@prisma/client";
import Button from "components/Button";
import Card from "components/Card";
import GlassPane from "components/GlassPane";
import NewProject from "components/project/NewProject";
import ProjectCard from "components/project/ProjectCard";
import Link from "next/link";
import { useState } from "react";

type TeamWithRelations = Team & {
  projects: (Project & { tasks: Task[] })[];
  members: (TeamMember & { user: User })[];
};

export default function TeamDashboard({ team }: { team: TeamWithRelations }) {
  const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invite/${team.inviteCode}`;
  const [copied, setCopied] = useState(false);

  function copyInvite() {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function getMemberProgress(userId: string) {
    const tasks = team.projects.flatMap((p) =>
      p.tasks.filter((t) => t.assignedToId === userId)
    );
    const completed = tasks.filter((t) => t.status === "COMPLETED").length;
    const progress =
      tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;

    return { completed, total: tasks.length, progress };
  }

  return (
    <div className="w-full mx-auto space-y-6 flex flex-col">
      {/* Team Info */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl text-gray-700 font-semibold">{team.name}</h1>
          <Button
            onClick={copyInvite}
            className="text-sm bg-violet-500 px-4 py-2 text-white hover:bg-violet-600 hover:scale-105 transition-all ease-in-out duration-200"
          >
            {copied ? "Copied!" : "Copy Invite Link"}
          </Button>
        </div>
        <p className="text-black">
          Share this link to invite members:{" "}
          <span className="font-mono text-sm text-gray-600">{inviteUrl}</span>
        </p>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 flex-1">
        {/* Projects List */}
        <div className="col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 h-fit gap-3 sm:gap-6">
          {team.projects.length > 0 &&
            team.projects.map((project) => (
              <div className="w-full" key={project.id}>
                <Link href={`/project/${project.id}`}>
                  <ProjectCard project={project} />
                </Link>
              </div>
            ))}
          <GlassPane className="rounded-3xl w-full flex items-center justify-center h-full drop-shadow-xl">
            <NewProject teamId={team.id} />
          </GlassPane>
        </div>

        {/* Members List */}
        <Card>
          <h2 className="text-xl text-gray-700 font-semibold mb-4">
            Team Members
          </h2>
          <ul className="space-y-2">
            {team.members.map((m) => {
              const { completed, total, progress } = getMemberProgress(
                m.user.id
              );

              return (
                <li
                  key={m.id}
                  className={`p-3 rounded-lg ${
                    m.role === "OWNER"
                      ? "bg-violet-200 text-gray-800"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      {m.user.firstName} {m.user.lastName}
                    </span>
                    <span className="text-xs font-semibold px-2 py-1 rounded-md bg-white shadow-sm">
                      {m.role}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
                    <div
                      className="h-2 bg-violet-500 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs mt-1">
                    {completed}/{total} tasks completed
                  </p>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>
    </div>
  );
}
