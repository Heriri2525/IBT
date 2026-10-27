// Minimal signed-cookie session (real auth arrives in week 9).
// The secret never leaves the server: this file is only imported by server code
// (actions.js, route handlers, server components).
import "server-only";
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "session";

// Production: set SESSION_SECRET. Without it we generate a throwaway secret, so
// sessions simply reset when the server restarts — never a hard-coded secret.
const SECRET = process.env.SESSION_SECRET || randomBytes(32).toString("hex");

const sign = (payload) => createHmac("sha256", SECRET).update(payload).digest("base64url");

export function createToken(name) {
  const payload = Buffer.from(JSON.stringify({ id: randomBytes(8).toString("hex"), name })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifyToken(token) {
  if (!token || !token.includes(".")) return null;
  const [payload, sig] = token.split(".");
  const expected = sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString());
  } catch {
    return null;
  }
}

// -> { id, name } or null
export async function getSession() {
  return verifyToken((await cookies()).get(SESSION_COOKIE)?.value);
}

export async function setSession(name) {
  (await cookies()).set(SESSION_COOKIE, createToken(name), {
    httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 8,
  });
}

export async function clearSession() {
  (await cookies()).delete(SESSION_COOKIE);
}
