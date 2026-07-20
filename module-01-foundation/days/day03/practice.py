print("Exercise 1: Unique Cities")

cities = [
    "Addis Ababa",
    "Adama",
    "Hawassa",
    "Addis Ababa",
    "Bahir Dar",
    "Adama",
    "Jimma"
]

# Remove duplicates
unique_cities = set(cities)

print("Distinct cities:")
for city in unique_cities:
    print(city)

print("Number of distinct cities:", len(unique_cities))


print("\nExercise 2: Price Report")

groceries = {
    "Rice": 120,
    "Sugar": 90,
    "Milk": 75,
    "Bread": 35,
    "Eggs": 180
}

# Display prices
for item, price in groceries.items():
    print(f"{item}: {price} ETB")


print("\nExercise 3: Tax Comprehension")

prices = [100, 250, 400, 80]

# Add tax
prices_with_tax = [price * 1.15 for price in prices]

print("Original prices:", prices)
print("Prices with 15% tax:", prices_with_tax)


print("\nExercise 4: Cheap Items")

# Get cheap prices
cheap_prices = [price for price in prices if price < 200]

print("Prices under 200 ETB:", cheap_prices)


print("\nExercise 5: Write & Read")

# Write names
with open("names.txt", "w") as file:
    file.write("Almaz\n")
    file.write("Dawit\n")
    file.write("Hanna\n")

print("Names in the file:")

# Read names
with open("names.txt", "r") as file:
    for name in file:
        print(name.strip())


print("\nExercise 6: Safe Division")

try:
    number = int(input("Enter a number: "))
    result = 1000 / number
    print("Result:", result)

except ValueError:
    print("Invalid input. Please enter a whole number.")

except ZeroDivisionError:
    print("You cannot divide by zero.")
