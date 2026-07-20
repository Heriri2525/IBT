print("Exercise 1: Book Class")


class Book:
    def __init__(self, title, author, pages):
        self.title = title
        self.author = author
        self.pages = pages

    def describe(self):
        print(f"'{self.title}' by {self.author} - {self.pages} pages")


book1 = Book("Atomic Habits", "James Clear", 320)
book2 = Book("Python Crash Course", "Eric Matthes", 544)

book1.describe()
book2.describe()


print("\nExercise 2, 3 & 4: Product Class")


class Product:
    def __init__(self, name, price, quantity):
        self.name = name
        self.price = price
        self.__quantity = quantity  # Private value

    # Get quantity
    @property
    def quantity(self):
        return self.__quantity

    # Update quantity
    @quantity.setter
    def quantity(self, value):
        if value >= 0:
            self.__quantity = value
        else:
            print("Quantity cannot be negative.")

    # Add stock
    def restock(self, n):
        self.__quantity += n

    # Sell product
    def sell(self, n):
        if n <= self.__quantity:
            self.__quantity -= n
        else:
            print(f"Cannot sell {n}. Only {self.__quantity} in stock.")

    def display(self):
        print(f"{self.name} | {self.price} ETB | Stock: {self.__quantity}")


print("\nExercise 5: Independence")


product1 = Product("Milk", 80, 10)
product2 = Product("Bread", 35, 20)
product3 = Product("Sugar", 90, 15)


print("Before changes:")
product1.display()
product2.display()
product3.display()


# Change one product only
product1.sell(4)
product1.restock(2)


print("\nAfter changing only Milk:")
product1.display()
product2.display()
product3.display()
