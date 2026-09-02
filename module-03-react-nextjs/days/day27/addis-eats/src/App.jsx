import { useState } from "react";
import Menu from "./Menu.jsx";
import menu from "./data.js";

function Header() {
  return (
    <header className="header">
      <h1>Addis Eats</h1>
      <p>Delicious Ethiopian food, made with love.</p>
    </header>
  );
}

function App() {
  const [category, setCategory] = useState("All");

  return (
    <div className="app">
      <Header />

      <main>
        <h2>Our Menu</h2>

        <div className="filters">
          <button onClick={() => setCategory("All")}>
            All
          </button>

          <button onClick={() => setCategory("Main")}>
            Main
          </button>

          <button onClick={() => setCategory("Side")}>
            Side
          </button>

          <button onClick={() => setCategory("Breakfast")}>
            Breakfast
          </button>

          <button onClick={() => setCategory("Dessert")}>
            Dessert
          </button>
        </div>

        <Menu menu={menu} category={category} />
      </main>
    </div>
  );
}

export default App;