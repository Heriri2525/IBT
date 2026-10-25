import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";
import { DEMO_USERS } from "./users";

// SERVER ONLY. The cookie value is "<userId>.<signature>". The signature is an HMAC of
// the user id made with SESSION_SECRET, which lives in .env.local and has no
// NEXT_PUBLIC_ prefix, so it does not exist in client code. Editing the cookie by hand
// breaks the signature and getSession() returns null.
//
// This is a DEMO login (pick an account, no password). Real authentication is Module 4;
// what matters today is WHERE the check lives: inside the action, every time.
export const SESSION_COOKIE = "session";

function secret() {
  const value = process.env.SESSION_SECRET;
  if (!value) throw new Error("SESSION_SECRET is not set. Copy .env.example to .env.local.");
  return value;
}

function sign(userId) {
  return createHmac("sha256", secret()).update(userId).digest("hex");
}

export function createSessionValue(userId) {
  return `${userId}.${sign(userId)}`;
}

// Returns { id, name } or null. Never throws: anything unverifiable is "not signed in".
export async function getSession() {
  const raw = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!raw) return null;

  const dot = raw.lastIndexOf(".");
  if (dot < 1) return null;
  const userId = raw.slice(0, dot);
  const given = Buffer.from(raw.slice(dot + 1));

  let expected;
  try {
    expected = Buffer.from(sign(userId));
  } catch {
    return null; // no secret configured: fail closed
  }
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null;

  return DEMO_USERS.find((u) => u.id === userId) ?? null;
}
