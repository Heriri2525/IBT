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
  return (
    <div className="app">
      <Header />

      <main>
        <h2>Our Menu</h2>

        <Menu menu={menu} />
      </main>
    </div>
  );
}

export default App;