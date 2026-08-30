import Dish from "./Dish.jsx";

const menu = [
  {
    id: 1,
    name: "Doro Wat",
    price: 240,
  },
  {
    id: 2,
    name: "Shiro",
    price: 120,
  },
  {
    id: 3,
    name: "Tibs",
    price: 280,
  },
  {
    id: 4,
    name: "Injera",
    price: 150,
  },
  {
    id: 5,
    name: "Kitfo",
    price: 350,
  },
  {
    id: 6,
    name: "Firfir",
    price: 180,
  },
];

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

        <div className="menu">
          {menu.map((dish) => (
            <Dish
              key={dish.id}
              name={dish.name}
              price={dish.price}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;