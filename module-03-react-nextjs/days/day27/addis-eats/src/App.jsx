import Menu from "./Menu";
import menu from "./data";

function Header() {
  return (
    <header className="header">
      <h1>Addis Eats</h1>
      <p>Delicious Ethiopian food, made with love.</p>
    </header>
  );
}

function App() {
  const category = "Main";

  return (
    <div className="app">
      <Header />

      <main>
        <h2>Our Menu</h2>

        <Menu menu={menu} category={category} />
      </main>
    </div>
  );
}

export default App;
