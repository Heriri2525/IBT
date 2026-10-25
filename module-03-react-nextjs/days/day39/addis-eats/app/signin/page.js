import { getSession } from "@/lib/session";
import { DEMO_USERS } from "@/lib/users";
import { signIn, signOut } from "./actions";

export const metadata = { title: "Sign in · Addis Eats" };

// Dynamic: it reads the session cookie. Plain forms with server actions: no client JS.
export default async function SignInPage() {
  const user = await getSession();
  return (
    <section>
      <h1>Sign in</h1>
      <p className="muted" style={{ marginBottom: "1rem" }}>
        Demo accounts only (no password). Orders you place while signed in are yours, and only
        you can cancel them.
      </p>
      {user && (
        <p className="notice" style={{ marginBottom: "1rem" }}>
          Signed in as <strong>{user.name}</strong>.
        </p>
      )}
      <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap" }}>
        {DEMO_USERS.map((u) => (
          <form key={u.id} action={signIn}>
            <input type="hidden" name="userId" value={u.id} />
            <button className="btn" type="submit">Sign in as {u.name}</button>
          </form>
        ))}
        {user && (
          <form action={signOut}>
            <button className="btn alt" type="submit">Sign out</button>
          </form>
        )}
      </div>
    </section>
  );
}
