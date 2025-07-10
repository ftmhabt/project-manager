import { validateJWT } from "@/lib/auth";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function PUT(req: Request) {
  const body = await req.json();

  const cookieStore = await cookies();
  const token = cookieStore.get(process.env.COOKIE_NAME || "")?.value;

  if (!token) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const user = await validateJWT(token);

  await db.task.update({
    where: {
      id: body.id,
      ownerId: user.id,
      projectId: body.projectId,
    },
    data: {
      status: body.status,
    },
  });

  // ✅ Trigger revalidation of the dynamic page
  revalidatePath(`/project/${body.projectId}`);

  return Response.json({ message: "ok" });
}
