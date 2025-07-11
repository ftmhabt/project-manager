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

  if (req.method === "POST") {
    try {
      await db.task.create({
        data: {
          name: req.body.name,
          ownerId: user.id,
          projectId: req.body.projectId,
          description: req.body.description,
          status: "NOT_STARTED",
        },
      });
    } catch (error) {
      res.status(400).json({ data: { errorMessage: error } });
    }

    res.json({ data: { message: "ok" } });
  }

  if (req.method === "PUT") {
    try {
      await db.task.update({
        where: {
          id: req.body.id,
          ownerId: user.id,
          projectId: req.body.projectId,
        },
        data: {
          name: req.body.name,
          description: req.body.description,
        },
      });
    } catch (error) {
      res.status(400).json({ data: { errorMessage: error } });
    }

    res.json({ data: { message: "ok" } });
  }
}
