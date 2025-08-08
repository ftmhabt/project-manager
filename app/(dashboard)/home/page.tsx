import Greeting from "@/components/home/Greeting";
import GreetingsSkeleton from "@/components/home/GreetingsSkeleton";
import NewProject from "@/components/project/NewProject";
import ProjectCard from "@/components/project/ProjectCard";
import TaskCard from "@/app/features/tasks/components/TaskCard";
import Link from "next/link";
import { Suspense } from "react";
import GlassPane from "@/components/GlassPane";
import { getAllProjects } from "@/app/features/tasks/actions/getAllProjects";

export default async function Page() {
  const projects = await getAllProjects();
  return (
    <div className="h-full overflow-y-auto pr-3 md:pr-3 w-full">
      <div className="h-full items-stretch justify-center min-h-[content]">
        <div className="flex-1 grow flex">
          <Suspense fallback={<GreetingsSkeleton />}>
            <Greeting />
          </Suspense>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 flex-2 mt-3 -m-3">
          {projects.map((project) => (
            <div className="w-full p-3" key={project.id}>
              <Link href={`/project/${project.id}`}>
                <ProjectCard project={project} />
              </Link>
            </div>
          ))}
          <div className="w-full p-3">
            <GlassPane className="rounded-3xl w-full flex items-center justify-center h-full drop-shadow-xl">
              <NewProject />
            </GlassPane>
          </div>
        </div>
        <div className="mt-6 flex-2 grow w-full flex">
          <div className="w-full">
            <TaskCard numbers={10} />
          </div>
        </div>
      </div>
    </div>
  );
}
