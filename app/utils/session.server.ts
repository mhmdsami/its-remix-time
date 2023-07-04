// based on https://github.com/kentcdodds/remix-tutorial-walkthrough/blob/main/app/utils/session.server.ts
import bcrypt from "bcryptjs";
import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { db } from "~/utils/db.server";

export async function signIn(username: string, password: string) {
  let user = await db.user.findFirst({ where: { username } });
  if (!user) return null;

  const passwordsMatch = await bcrypt.compare(password, user.passwordHash);

  if (!passwordsMatch) return null;

  return user;
}

let sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET is missing in .env");
}

const storage = createCookieSessionStorage({
  cookie: {
    name: "remix_session",
    secure: true,
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

export async function createUserSession(userId: string, redirectTo: string) {
  let session = await storage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}

function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

export async function getUserId(request: Request) {
  let session = await getUserSession(request);
  let userId = session.get("userId");
  if (typeof userId !== "string") return null;
  return userId;
}

export async function requireUserId(request: Request) {
  let userId = await getUserId(request);
  if (!userId) {
    throw redirect(`/signin`);
  }
  return userId;
}

export async function getUser(request: Request) {
  let userId = await getUserId(request);
  if (!userId) return null;
  return db.user.findUnique({ where: { id: userId } });
}

export async function logout(request: Request) {
  let session = await getUserSession(request);
  return redirect("/", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
}
