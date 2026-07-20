# Temperature label

temperature = float(input("Enter the temperature in °C: "))

if temperature < 15:
    print("cold")
elif 15 <= temperature <= 28:
    print("warm")
else:
    print("hot")


print("\n-----------------------------")


# Receipt loop

for i in range(1, 11):
    print(f"Receipt #{i}")


print("\n-----------------------------")


# Even numbers

print("Even numbers from 1 to 20:")

for i in range(1, 21):
    if i % 2 == 0:
        print(i)


print("\n-----------------------------")


# Discount function

def apply_discount(price, percent=10):
    discount = price * (percent / 100)
    return price - discount


# Default discount
print("Default discount:")
print(apply_discount(1000))


# Custom discount
print("Custom discount (20%):")
print(apply_discount(1000, 20))


print("\n-----------------------------")


# Countdown

count = 5

while count >= 1:
    print(count)
    count -= 1

print("Liftoff!")
