from abc import ABC, abstractmethod


# Base class

class Vehicle(ABC):
    def __init__(self, make, model):
        self.make = make
        self.model = model

    def describe(self):
        print(f"Make: {self.make}, Model: {self.model}")

    @abstractmethod
    def wheels(self):
        pass


# Car and Truck

class Car(Vehicle):
    def __init__(self, make, model):
        super().__init__(make, model)

    def wheels(self):
        return 4


class Truck(Vehicle):
    def __init__(self, make, model, capacity):
        super().__init__(make, model)
        self.capacity = capacity

    # Different description
    def describe(self):
        print(f"Make: {self.make}, Model: {self.model}, Capacity: {self.capacity}")

    def wheels(self):
        return 6


# Test

vehicles = [
    Car("Toyota", "Corolla"),
    Car("Honda", "Civic"),
    Truck("Volvo", "FH16", "25 tons"),
]

for vehicle in vehicles:
    vehicle.describe()
    print(f"Wheels: {vehicle.wheels()}")
    print("-" * 30)
