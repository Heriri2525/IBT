import { createContext } from "react";

// Private to the auth module — consumers use useAuth().
export const AuthContext = createContext(null);
