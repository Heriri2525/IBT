import random

# Exercise 1

print("Exercise 1: Recursion")


# Sum a list
def total(nums):
    if not nums:
        return 0
    return nums[0] + total(nums[1:])


# Count down
def count_down(n):
    if n <= 0:
        return
    print(n)
    count_down(n - 1)


numbers = [10, 20, 30, 40, 50]

print("Total:", total(numbers))

count_down(5)


# Exercise 2

print("\nExercise 2: Binary Search")


def binary_search(items, target):
    left = 0
    right = len(items) - 1

    while left <= right:
        middle = (left + right) // 2

        if items[middle] == target:
            return middle

        elif items[middle] < target:
            left = middle + 1

        else:
            right = middle - 1

    return -1


balances = [500, 1000, 1500, 2000, 2500, 3000]

print(binary_search(balances, 2500))
print(binary_search(balances, 1200))


# Exercise 3

print("\nExercise 3: Merge Sort")


def merge(left, right):
    result = []

    while left and right:
        if left[0] < right[0]:
            result.append(left.pop(0))
        else:
            result.append(right.pop(0))

    result.extend(left)
    result.extend(right)

    return result


def merge_sort(items):
    if len(items) <= 1:
        return items

    middle = len(items) // 2

    left = merge_sort(items[:middle])
    right = merge_sort(items[middle:])

    return merge(left, right)


random_list = random.sample(range(1, 100), 10)

print("Original:", random_list)
print("Merge Sort:", merge_sort(random_list.copy()))
print("Python Sort:", sorted(random_list))


# Exercise 4

print("\nExercise 4: Sort with Key")

accounts = [
    ("Hermela", 5000),
    ("Almaz", 3000),
    ("Dawit", 7000),
    ("Hanna", 2500)
]

sorted_accounts = sorted(
    accounts,
    key=lambda account: account[1],
    reverse=True
)

for account in sorted_accounts:
    print(account)


# Exercise 5

print("\nExercise 5: Two Pointers")


def has_pair(nums, target):
    left = 0
    right = len(nums) - 1

    while left < right:
        current = nums[left] + nums[right]

        if current == target:
            return True

        elif current < target:
            left += 1

        else:
            right -= 1

    return False


values = [2, 4, 7, 11, 15, 18, 20]

print(has_pair(values, 22))
print(has_pair(values, 40))
