import { validateJWT } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = await validateJWT(
    req.cookies[process.env.COOKIE_NAME || ""] || ""
  );

  await db.task.create({
    data: {
      name: req.body.name,
      ownerId: user.id,
      projectId: req.body.projectId,
      description: req.body.description,
      status: "NOT_STARTED",
    },
  });

  res.json({ data: { message: "ok" } });
}
