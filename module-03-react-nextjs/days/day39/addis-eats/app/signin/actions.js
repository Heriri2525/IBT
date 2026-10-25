"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, createSessionValue } from "@/lib/session";
import { DEMO_USERS } from "@/lib/users";

export async function signIn(formData) {
  const userId = String(formData.get("userId") ?? "");
  const user = DEMO_USERS.find((u) => u.id === userId);
  if (!user) return; // not one of the demo accounts: do nothing

  (await cookies()).set(SESSION_COOKIE, createSessionValue(user.id), {
    httpOnly: true, // JavaScript in the page cannot read it
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  redirect("/orders");
}

export async function signOut() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/signin");
}
