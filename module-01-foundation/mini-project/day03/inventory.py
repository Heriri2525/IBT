# Store stock
stock = {}


# Read stock file
try:
    with open("stock.txt", "r") as file:
        for line in file:
            item, qty = line.strip().split(",")
            stock[item] = int(qty)

except FileNotFoundError:
    print("No stock file yet — starting empty.")


# Update stock
def adjust(item, amount):
    stock[item] = stock.get(item, 0) + amount


print("\n===== Current Inventory =====")
for item, qty in stock.items():
    print(f"{item}: {qty}")


# Get update from user
item = input("\nEnter item name: ").title()
amount = int(input("Enter quantity to add (+) or remove (-): "))

adjust(item, amount)


# Show updated stock
print("\n===== Updated Inventory =====")
for item, qty in stock.items():
    print(f"{item}: {qty}")


# Find low stock
low_stock = [item for item, qty in stock.items() if qty < 10]

print("\n===== Low Stock Items =====")
if low_stock:
    for item in low_stock:
        print(item)
else:
    print("No low stock items.")


# Save stock
with open("stock.txt", "w") as file:
    for item, qty in stock.items():
        file.write(f"{item},{qty}\n")

print("\nInventory saved successfully!")
