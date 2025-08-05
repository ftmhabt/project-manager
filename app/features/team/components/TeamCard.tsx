"use client";
import { Project, Task, Team, TeamMember, User } from "@/app/generated/prisma";
import Card from "@/components/Card";
import Link from "next/link";
import { useState } from "react";

type TeamWithRelations = Team & {
  projects: (Project & { tasks: Task[] })[];
  members: (TeamMember & { user: User })[];
};

const TeamCard = ({ team }: { team: TeamWithRelations }) => {
  const [open, setOpen] = useState(false);

  const totalProjects = team.projects.length;
  const totalTasks = team.projects.reduce(
    (sum, project) => sum + project.tasks.length,
    0
  );
  return (
    <Card className="px-6 py-8 hover:scale-105 transition-all ease-in-out duration-200 flex flex-col">
      <div className="mb-4 flex justify-between items-start flex-1">
        <Link href={`/team/${team.id}`}>
          <span className="text-3xl text-gray-600">{team.name}</span>
        </Link>
        <div className="relative">
          <button
            onClick={() => setOpen((p) => !p)}
            className="text-sm bg-violet-500 px-3 py-1 rounded-lg text-nowrap"
          >
            Members ▼
          </button>
          {open && (
            <div className="absolute left-0 top-full mt-2 bg-white shadow p-1 rounded-lg">
              <ul className="space-y-1">
                {team.members &&
                  team.members.map((m) => (
                    <li
                      key={m.id}
                      className={`text-sm p-2 ${
                        m.role === "OWNER"
                          ? "text-gray-800 bg-violet-200 rounded-md"
                          : "text-gray-600"
                      } `}
                    >
                      {m.user.firstName} {m.user.lastName}
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="mb-2 text-gray-700">
        <p>
          {totalProjects} Project{totalProjects !== 1 ? "s" : ""}
        </p>
        <p>
          {totalTasks} Task{totalTasks !== 1 ? "s" : ""}
        </p>
      </div>
    </Card>
  );
};

export default TeamCard;
