import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function Login() {
  const { user, login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  // where the guard sent us from (default: the menu)
  const from = location.state?.from?.pathname ?? "/menu";

  // already signed in -> redirect while rendering
  if (user) return <Navigate to={from} replace />;

  async function signIn(event) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await login(phone);
      navigate(from, { replace: true }); // back to /checkout
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <main className="page">
      <form className="order-form" onSubmit={signIn}>
        <h2>Sign in</h2>
        {location.state?.from && (
          <p className="category">Please sign in to continue to checkout.</p>
        )}
        <div className="form-group">
          <label htmlFor="phone">Phone number</label>
          <input
            id="phone"
            type="tel"
            placeholder="0912345678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoFocus
          />
          {error && <p className="error">{error}</p>}
        </div>
        <button className="pay-button" disabled={busy}>
          {busy ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </main>
  );
}

export default Login;
