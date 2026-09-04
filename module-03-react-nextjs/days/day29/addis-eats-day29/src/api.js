export async function loadDishes(category, signal) {
  const response = await fetch("/dishes.json", {
    signal
  });

  if (!response.ok) {
    throw new Error("Could not load the Addis Eats menu.");
  }

  const dishes = await response.json();

  if (category === "All") {
    return dishes;
  }

  return dishes.filter((dish) => dish.category === category);
}