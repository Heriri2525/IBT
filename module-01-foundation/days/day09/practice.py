import heapq


# Exercise 1: Binary Search Tree

print("Exercise 1: Binary Search Tree")


class Node:

    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None


def insert(root, value):

    if root is None:
        return Node(value)

    if value < root.value:
        root.left = insert(root.left, value)

    else:
        root.right = insert(root.right, value)

    return root


def inorder(root):

    if root:
        inorder(root.left)
        print(root.value)
        inorder(root.right)


balances = [5000, 2000, 7000, 1500, 3000, 6000]

root = None

for balance in balances:
    root = insert(root, balance)


print("Sorted balances:")
inorder(root)



# Exercise 2: Tree Depth

print("\nExercise 2: Tree Depth")


def height(node):

    if node is None:
        return 0

    return max(
        height(node.left),
        height(node.right)
    ) + 1


print("Tree height:", height(root))



# Exercise 3: Graph BFS

print("\nExercise 3: Graph BFS")


graph = {
    "ACC001": ["ACC002", "ACC003"],
    "ACC002": ["ACC004"],
    "ACC003": ["ACC005"],
    "ACC004": [],
    "ACC005": []
}


def bfs(graph, start):

    visited = set()
    queue = [start]

    while queue:

        current = queue.pop(0)

        if current not in visited:

            visited.add(current)

            for neighbor in graph[current]:
                queue.append(neighbor)

    return visited


print("BFS:", bfs(graph, "ACC001"))



# Exercise 4: Graph DFS

print("\nExercise 4: Graph DFS")


def dfs(graph, start, visited=None):

    if visited is None:
        visited = []

    visited.append(start)

    for neighbor in graph[start]:

        if neighbor not in visited:
            dfs(graph, neighbor, visited)

    return visited


print("DFS:", dfs(graph, "ACC001"))



# Exercise 5: Priority Queue

print("\nExercise 5: Priority Queue")


tasks = []

heapq.heappush(tasks, (3, "Check account balance"))
heapq.heappush(tasks, (1, "Process withdrawal"))
heapq.heappush(tasks, (5, "Send report"))
heapq.heappush(tasks, (2, "Approve loan"))
heapq.heappush(tasks, (4, "Update profile"))


print("Tasks by priority:")

while tasks:

    priority, task = heapq.heappop(tasks)

    print(priority, "-", task)
