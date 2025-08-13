import { serialize } from "cookie";
import { createJWT, hashPassword } from "lib/auth";
import { db } from "lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password, firstName, lastName } = await req.json();

  try {
    const user = await db.user.create({
      data: {
        email,
        password: await hashPassword(password),
        firstName,
        lastName,
      },
    });

    const jwt = await createJWT(user);

    const cookie = serialize(process.env.COOKIE_NAME as string, jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });

    return new NextResponse(JSON.stringify({}), {
      status: 201,
      headers: {
        "Set-Cookie": cookie,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
