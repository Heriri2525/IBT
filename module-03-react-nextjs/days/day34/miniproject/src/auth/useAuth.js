import { useContext } from "react";
import { AuthContext } from "./authContext";

// Friendly front door: the context object stays private to the auth folder,
// and forgetting <AuthProvider> fails immediately with a clear message.
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === null) {
    throw new Error("useAuth must be used inside an <AuthProvider>");
  }
  return ctx;
}
