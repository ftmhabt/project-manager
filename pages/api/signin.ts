import { comparePasswords, createJWT } from "@/lib/auth";
import { db } from "@/lib/db";
import { serialize } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";

export default async function signin(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { email, password } = req.body;

  // Input validation
  if (
    !email ||
    typeof email !== "string" ||
    !password ||
    typeof password !== "string"
  ) {
    return res
      .status(400)
      .json({ message: "Email and password are required and must be strings" });
  }

  try {
    const user = await db.user.findUnique({
      where: { email },
    });

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare password securely
    const isValid = await comparePasswords(password, user.password);

    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create JWT
    const jwt = await createJWT(user);

    // Set secure cookie
    res.setHeader(
      "Set-Cookie",
      serialize(process.env.COOKIE_NAME as string, jwt, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
        sameSite: "lax",
      })
    );

    return res.status(200).json({ message: "Signed in successfully" });
  } catch (error) {
    console.error("Signin error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
