import bcrypt from "bcryptjs";
import { jwtVerify, SignJWT } from "jose";
import { db } from "./db";
import { cookies } from "next/headers";

type JWTPayload = {
  id: string;
  email: string;
  iat?: number;
  exp?: number;
  nbf?: number;
};

export const hashPassword = (password: string) => bcrypt.hash(password, 10);

export const comparePasswords = (
  plainTextPassword: string,
  hashedPassword: string
) => bcrypt.compare(plainTextPassword, hashedPassword);

export const createJWT = (user: User) => {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 60 * 60 * 24 * 7;

  return new SignJWT({
    payload: { id: user.id, email: user.email },
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setExpirationTime(exp)
    .setIssuedAt(iat)
    .setNotBefore(iat)
    .sign(new TextEncoder().encode(process.env.JWT_SECRET));
};

export const validateJWT = async (jwt: string) => {
  const { payload } = await jwtVerify(
    jwt,
    new TextEncoder().encode(process.env.JWT_SECRET)
  );
  return payload.payload as JWTPayload;
};

export const getUserFromCookie = async () => {
  const allCookies = await cookies();
  const jwt = allCookies.get(process.env.COOKIE_NAME || "");
  if (jwt) {
    const { id } = await validateJWT(jwt.value);

    const user = await db.user.findUnique({
      where: {
        id,
      },
    });

    return user;
  }
};

type User = {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};
