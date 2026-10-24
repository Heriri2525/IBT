import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

// Guard component: renders its children only for a signed-in person.
function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // 1. wait for the session to be read — otherwise a refresh would bounce
  //    a signed-in student to /login (user is null while loading)
  if (loading) return <p className="loading">Checking your session...</p>;

  // 2. redirect while RENDERING (a component, not navigate()), with `replace`
  //    so Back doesn't return to the rejected page, and remember the destination
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

export default RequireAuth;
