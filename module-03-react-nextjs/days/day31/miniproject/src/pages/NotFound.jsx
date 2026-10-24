import { Link } from "react-router-dom";

function NotFound({ message = "That page does not exist." }) {
  return (
    <main className="page not-found">
      <h2>404 — Not found</h2>
      <p>{message}</p>
      <Link to="/menu" className="cta">
        Back to the menu
      </Link>
    </main>
  );
}

export default NotFound;
