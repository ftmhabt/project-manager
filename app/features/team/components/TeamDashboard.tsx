"use client";
import { Project, Task, Team, TeamMember, User } from "@/app/generated/prisma";
import Card from "@/components/Card";
import ProjectCard from "@/components/ProjectCard";
import Link from "next/link";
import { useState } from "react";

type TeamWithRelations = Team & {
  projects: (Project & { tasks: Task[] })[];
  members: (TeamMember & { user: User })[];
};

export default function TeamDashboard({ team }: { team: TeamWithRelations }) {
  const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/team/invite/${team.inviteCode}`;
  const [copied, setCopied] = useState(false);

  function copyInvite() {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="w-full mx-auto space-y-6 flex flex-col">
      {/* Team Info */}
      <Card className="hover:scale-105 transition-all ease-in-out duration-200">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl text-gray-700 font-semibold">{team.name}</h1>
          <button
            onClick={copyInvite}
            className="text-sm bg-violet-500 px-4 py-2 rounded-lg text-white hover:bg-violet-600 transition"
          >
            {copied ? "Copied!" : "Copy Invite Link"}
          </button>
        </div>
        <p className="text-black">
          Share this link to invite members:{" "}
          <span className="font-mono text-sm text-gray-600">{inviteUrl}</span>
        </p>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 flex-1">
        {/* Projects List */}
        <Card className="col-span-2">
          {team.projects.length > 0 ? (
            team.projects.map((project) => (
              <div className="sm:w-1/3 w-full p-3" key={project.id}>
                <Link href={`/project/${project.id}`}>
                  <ProjectCard project={project} />
                </Link>
              </div>
            ))
          ) : (
            <p className="text-black">No projects found.</p>
          )}
        </Card>

        {/* Members List */}
        <Card>
          <h2 className="text-xl text-gray-700 font-semibold mb-4">
            Team Members
          </h2>
          <ul className="space-y-2">
            {team.members.map((m) => (
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
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
