import { useTheme } from "../theme/ThemeContext";

// Deeply nested (App > Header > ThemeToggle) yet no theme prop passed.
function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button className="theme-toggle" onClick={toggle}>
      {theme === "light" ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}

export default ThemeToggle;
