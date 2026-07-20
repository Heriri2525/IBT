from abc import ABC, abstractmethod
import math

# Exercise 1

print("Exercise 1: SRP")

class Report:
    def build(self):
        return "Monthly Sales Report"


# Saves the report
class ReportSaver:
    def save(self, report):
        print(f"Saving report: {report}")


# Sends the report
class ReportEmailer:
    def email(self, report):
        print(f"Emailing report: {report}")


report = Report()
text = report.build()

saver = ReportSaver()
emailer = ReportEmailer()

saver.save(text)
emailer.email(text)


# Exercise 2

print("\nExercise 2: OCP")


# Base class for shapes
class Shape(ABC):

    @abstractmethod
    def area(self):
        pass


class Circle(Shape):
    def __init__(self, radius):
        self.radius = radius

    def area(self):
        return math.pi * self.radius ** 2


class Square(Shape):
    def __init__(self, side):
        self.side = side

    def area(self):
        return self.side ** 2


class Triangle(Shape):
    def __init__(self, base, height):
        self.base = base
        self.height = height

    def area(self):
        return 0.5 * self.base * self.height


shapes = [
    Circle(5),
    Square(4),
    Triangle(6, 3)
]

for shape in shapes:
    print(f"Area: {shape.area():.2f}")


# Exercise 3

print("\nExercise 3: Singleton")


# Only one object will be created
class AppSettings:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.currency = "ETB"
        return cls._instance


settings1 = AppSettings()
settings2 = AppSettings()

print("Currency:", settings1.currency)
print("Same object:", settings1 is settings2)


# Exercise 4

print("\nExercise 4: Factory")


# Creates shapes
class ShapeFactory:

    @staticmethod
    def create(kind):
        if kind.lower() == "circle":
            return Circle(3)
        elif kind.lower() == "square":
            return Square(5)
        elif kind.lower() == "triangle":
            return Triangle(4, 6)
        else:
            raise ValueError("Unknown shape")


shape = ShapeFactory.create("circle")
print(f"Circle Area: {shape.area():.2f}")

shape = ShapeFactory.create("square")
print(f"Square Area: {shape.area():.2f}")

shape = ShapeFactory.create("triangle")
print(f"Triangle Area: {shape.area():.2f}")


# Exercise 5

print("\nExercise 5: Observer")


# Keeps the subscribers
class NewsAgency:
    def __init__(self):
        self.subscribers = []

    def subscribe(self, subscriber):
        self.subscribers.append(subscriber)

    def notify(self, news):
        for subscriber in self.subscribers:
            subscriber.update(news)


class MobileSubscriber:
    def update(self, news):
        print(f"Mobile received: {news}")


class EmailSubscriber:
    def update(self, news):
        print(f"Email received: {news}")


agency = NewsAgency()

mobile = MobileSubscriber()
email = EmailSubscriber()

agency.subscribe(mobile)
agency.subscribe(email)

agency.notify("New banking services are available!")
