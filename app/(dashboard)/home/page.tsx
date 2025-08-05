import Greeting from "@/components/home/Greeting";
import GreetingsSkeleton from "@/components/home/GreetingsSkeleton";
import NewProject from "@/components/project/NewProject";
import ProjectCard from "@/components/project/ProjectCard";
import TaskCard from "@/app/features/tasks/components/TaskCard";
import { getUserFromCookie } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { Suspense } from "react";

export const getData = async () => {
  const user = await getUserFromCookie();

  if (!user) return { projects: [] };

  const projects = await db.project.findMany({
    where: {
      OR: [
        { ownerId: user.id },
        { team: { members: { some: { userId: user.id } } } },
      ],
    },
    include: {
      tasks: true,
      team: true,
    },
  });

  return { projects };
};
export default async function Page() {
  const { projects } = await getData();
  return (
    <div className="h-full overflow-y-auto pr-3 md:pr-3 w-full">
      <div className="h-full items-stretch justify-center min-h-[content]">
        <div className="flex-1 grow flex">
          <Suspense fallback={<GreetingsSkeleton />}>
            <Greeting />
          </Suspense>
        </div>
        <div className="flex flex-2 grow items-center flex-wrap flex-col sm:flex-row mt-3 -m-3">
          {projects.map((project) => (
            <div className="sm:w-1/3 w-full p-3" key={project.id}>
              <Link href={`/project/${project.id}`}>
                <ProjectCard project={project} />
              </Link>
            </div>
          ))}
          <div className="w-1/3 p-3">
            <NewProject />
          </div>
        </div>
        <div className="mt-6 flex-2 grow w-full flex">
          <div className="w-full">
            <TaskCard />
          </div>
        </div>
      </div>
    </div>
  );
}
