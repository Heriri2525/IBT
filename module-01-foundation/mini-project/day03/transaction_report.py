# Store customer spending
customer_totals = {}

try:
    # Read transactions
    with open("transactions.txt", "r") as file:
        for line in file:
            name, amount = line.strip().split(",")
            amount = float(amount)

            # Add spending
            customer_totals[name] = customer_totals.get(name, 0) + amount

except FileNotFoundError:
    print("Error: transactions.txt was not found.")
    exit()


# Sort by highest spending
sorted_customers = sorted(
    customer_totals.items(),
    key=lambda customer: customer[1],
    reverse=True
)


print("===== TeleBirr Customer Spending Report =====")


# Save report

with open("report.txt", "w") as report:
    report.write("TeleBirr Customer Spending Report\n")
    report.write("=" * 35 + "\n")

    for name, total in sorted_customers:
        line = f"{name}: {total:.2f} ETB"
        print(line)
        report.write(line + "\n")


print("\nReport saved to report.txt")
