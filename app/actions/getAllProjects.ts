"use server";

import { db } from "@/lib/db";

export const getAllProjects = async () => {
  const projects = await db.project.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  return projects;
};
