from collections import deque
import time

# Exercise 1

print("Exercise 1: Big O")

numbers = [10, 20, 30, 40, 50]

# O(1) - Direct index access
print(numbers[2])

# O(n) - One loop
for num in numbers:
    print(num)

# O(n²) - Nested loops
for i in numbers:
    for j in numbers:
        pass

data = {"A001": 100, "A002": 200}

# O(1) - Dictionary lookup
print(data["A001"])


# O(log n) - Binary search
def binary_search(arr, target):
    left = 0
    right = len(arr) - 1

    while left <= right:
        mid = (left + right) // 2

        if arr[mid] == target:
            return mid

        elif arr[mid] < target:
            left = mid + 1

        else:
            right = mid - 1

    return -1


sorted_numbers = list(range(100))
print(binary_search(sorted_numbers, 75))


# Exercise 2

print("\nExercise 2: List vs Dict Lookup")

accounts_list = [f"ACC{i}" for i in range(100000)]
accounts_dict = {f"ACC{i}": i for i in range(100000)}

target = "ACC99999"

start = time.perf_counter()
target in accounts_list
end = time.perf_counter()
print("List lookup:", end - start)

start = time.perf_counter()
accounts_dict.get(target)
end = time.perf_counter()
print("Dict lookup:", end - start)


# Exercise 3

print("\nExercise 3: Stack")


class Stack:

    def __init__(self):
        self.items = []

    def push(self, item):
        self.items.append(item)

    def pop(self):
        return self.items.pop()

    def peek(self):
        return self.items[-1]


names = ["Hermela", "Almaz", "Dawit", "Hanna"]

stack = Stack()

for name in names:
    stack.push(name)

reversed_names = []

while stack.items:
    reversed_names.append(stack.pop())

print(reversed_names)


# Exercise 4

print("\nExercise 4: Queue")

queue = deque()

queue.append("Almaz")
queue.append("Dawit")
queue.append("Hanna")
queue.append("Samuel")
queue.append("Tigist")

while queue:
    print("Serving:", queue.popleft())


# Exercise 5

print("\nExercise 5: Linked List")


class Node:

    def __init__(self, data):
        self.data = data
        self.next = None


class LinkedList:

    def __init__(self):
        self.head = None

    def push_front(self, data):
        new_node = Node(data)
        new_node.next = self.head
        self.head = new_node

    def print_all(self):
        current = self.head

        while current:
            print(current.data)
            current = current.next


linked = LinkedList()

linked.push_front("Milk")
linked.push_front("Bread")
linked.push_front("Sugar")

linked.print_all()
