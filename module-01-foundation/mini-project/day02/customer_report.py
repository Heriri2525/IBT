# Customer list

customers = [
    ("Almaz", 1500),
    ("Dawit", 700),
    ("Tigist", 200),
    ("Hanna", 1200),
    ("Samuel", 450),
]


# Check customer tier
def tier(balance):
    if balance >= 1000:
        return "Premium"
    elif balance >= 500:
        return "Standard"
    else:
        return "Basic"


# Count tiers
premium_count = 0
standard_count = 0
basic_count = 0


print("===== TeleBirr Customer Report =====\n")


# Display customer report
for name, balance in customers:
    customer_tier = tier(balance)

    print(f"Name: {name}")
    print(f"Tier: {customer_tier}")
    print(f"Balance: {balance} ETB")
    print("-" * 30)


    # Update count
    if customer_tier == "Premium":
        premium_count += 1
    elif customer_tier == "Standard":
        standard_count += 1
    else:
        basic_count += 1


# Show summary

print("\n===== Summary =====")
print(f"Premium Customers : {premium_count}")
print(f"Standard Customers: {standard_count}")
print(f"Basic Customers   : {basic_count}")
