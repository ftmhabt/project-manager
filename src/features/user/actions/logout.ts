"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

const COOKIE_NAME = process.env.COOKIE_NAME || "token";

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "", {
    path: "/",
    expires: new Date(0),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  redirect("/auth");
}
