# Bank settings

class BankConfig:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.interest_rate = 0.05
            cls._instance.overdraft_limit = 1000
        return cls._instance


config = BankConfig()


# Alert classes

class SMSAlert:
    def update(self, message):
        print(f"[SMS] {message}")


class AuditLog:
    def update(self, message):
        print(f"[Audit] {message}")


# Account class

class Account:
    def __init__(self, owner, account_number, balance=0):
        self.owner = owner
        self.account_number = account_number
        self.__balance = balance
        self._observers = []
        self.history = []

    @property
    def balance(self):
        return self.__balance

    def _get_balance(self):
        return self.__balance

    def _set_balance(self, amount):
        self.__balance = amount


    # Observer methods

    def subscribe(self, observer):
        self._observers.append(observer)


    def _notify(self, message):
        for observer in self._observers:
            observer.update(message)


    # Deposit money

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("Deposit amount must be positive.")

        self._set_balance(self.balance + amount)

        # Store transaction history
        self.history.append(("deposit", amount))

        self._notify(
            f"{self.owner} deposited {amount} ETB"
        )


    # Withdraw money

    def withdraw(self, amount):
        if amount <= 0:
            raise ValueError("Withdrawal amount must be positive.")

        if amount > self.balance:
            raise ValueError("Insufficient balance.")

        self._set_balance(self.balance - amount)

        # Store transaction history
        self.history.append(("withdraw", amount))

        self._notify(
            f"{self.owner} withdrew {amount} ETB"
        )


    # Undo last transaction

    def undo_last(self):

        if not self.history:
            print("No transactions to undo.")
            return

        action, amount = self.history.pop()

        if action == "deposit":
            self._set_balance(self.balance - amount)

        elif action == "withdraw":
            self._set_balance(self.balance + amount)

        print(f"Undo: {action} {amount} ETB")


    def statement(self):
        print("\n===== Account =====")
        print(f"Owner: {self.owner}")
        print(f"Account Number: {self.account_number}")
        print(f"Balance: {self.balance:.2f} ETB")
# Savings account

class SavingsAccount(Account):

    def __init__(self, owner, account_number, balance=0):
        super().__init__(owner, account_number, balance)
        self.rate = config.interest_rate


    # Add interest

    def add_interest(self):
        self.deposit(self.balance * self.rate)


    def statement(self):
        print("\n===== Savings Account =====")
        print(f"Owner: {self.owner}")
        print(f"Account Number: {self.account_number}")
        print(f"Interest Rate: {self.rate * 100:.0f}%")
        print(f"Balance: {self.balance:.2f} ETB")



# Current account

class CurrentAccount(Account):

    def __init__(self, owner, account_number, balance=0):
        super().__init__(owner, account_number, balance)
        self.overdraft = config.overdraft_limit


    def withdraw(self, amount):

        if amount <= 0:
            raise ValueError("Withdrawal amount must be positive.")


        if self.balance - amount < -self.overdraft:
            raise ValueError("Overdraft limit exceeded.")


        self._set_balance(self.balance - amount)

        # Store transaction history
        self.history.append(("withdraw", amount))

        self._notify(
            f"{self.owner} withdrew {amount} ETB"
        )


    def statement(self):
        print("\n===== Current Account =====")
        print(f"Owner: {self.owner}")
        print(f"Account Number: {self.account_number}")
        print(f"Overdraft: {self.overdraft} ETB")
        print(f"Balance: {self.balance:.2f} ETB")



# Account Factory

class AccountFactory:

    @staticmethod
    def create(kind, owner, account_number, balance=0):

        if kind.lower() == "savings":
            return SavingsAccount(
                owner,
                account_number,
                balance
            )

        elif kind.lower() == "current":
            return CurrentAccount(
                owner,
                account_number,
                balance
            )

        else:
            raise ValueError("Invalid account type.")



# Binary Search

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

# Account Registry

class AccountRegistry:

    def __init__(self):
        self.by_number = {}
        self.order = []


    # Add account

    def add(self, account):

        self.by_number[account.account_number] = account
        self.order.append(account.account_number)



    # O(1) lookup

    def find(self, account_number):

        return self.by_number.get(account_number)



    # Display all accounts

    def list_all(self):

        for number in self.order:
            self.by_number[number].statement()



    # Day 08 leaderboard

    def top_by_balance(self, n=5):

        accounts = sorted(
            self.by_number.values(),
            key=lambda account: account.balance,
            reverse=True
        )

        return accounts[:n]



    # Binary search account number

    def find_by_number(self, number):

        numbers = sorted(self.by_number.keys())

        index = binary_search(
            numbers,
            number
        )


        if index == -1:
            return None


        return self.by_number[numbers[index]]



    # Recursive transaction total

    def total_transactions(self, number):

        account = self.find(number)


        if account is None:
            return 0



        def calculate(history):

            if not history:
                return 0


            return (
                history[0][1]
                +
                calculate(history[1:])
            )


        return calculate(account.history)

# Branch Tree

class Branch:

    def __init__(self, name):

        self.name = name
        self.children = []
        self.accounts = []


    # Add child branch

    def add_child(self, branch):

        self.children.append(branch)



    # Add account to branch

    def add_account(self, account):

        self.accounts.append(account)



    # Recursive total balance

    def total_balance(self):

        total = sum(
            account.balance
            for account in self.accounts
        )


        for child in self.children:

            total += child.total_balance()


        return total



# Transfers Graph

transfers = {
    "ACC001": ["ACC002", "ACC003"],
    "ACC002": ["ACC004"],
    "ACC003": ["ACC005"],
    "ACC004": [],
    "ACC005": []
}



# Breadth First Search

def bfs(transfers, start):

    visited = []
    queue = [start]


    while queue:

        current = queue.pop(0)


        if current not in visited:

            visited.append(current)


            for account in transfers.get(current, []):

                queue.append(account)


    return visited

# Testing

sms = SMSAlert()
audit = AuditLog()


# Create registry

registry = AccountRegistry()


# Create accounts

acc1 = AccountFactory.create(
    "savings",
    "Hermela",
    "ACC001",
    5000
)

acc2 = AccountFactory.create(
    "current",
    "Almaz",
    "ACC002",
    3000
)

acc3 = AccountFactory.create(
    "savings",
    "Dawit",
    "ACC003",
    8000
)

acc4 = AccountFactory.create(
    "current",
    "Hanna",
    "ACC004",
    2000
)

acc5 = AccountFactory.create(
    "savings",
    "Samuel",
    "ACC005",
    6000
)



# Subscribe alerts

for account in [
    acc1,
    acc2,
    acc3,
    acc4,
    acc5
]:

    account.subscribe(sms)
    account.subscribe(audit)



# Add accounts to registry

registry.add(acc1)
registry.add(acc2)
registry.add(acc3)
registry.add(acc4)
registry.add(acc5)



# Transactions

acc1.deposit(1000)
acc1.withdraw(500)

acc2.deposit(700)
acc2.withdraw(1000)

acc3.deposit(2000)

acc4.withdraw(500)

acc5.deposit(300)



# Registry tests

print("\n===== Find Account =====")

account = registry.find("ACC001")

if account:
    account.statement()



print("\n===== Top 3 Accounts =====")

top_accounts = registry.top_by_balance(3)

for account in top_accounts:
    account.statement()



print("\n===== Binary Search Account =====")

account = registry.find_by_number("ACC003")

if account:
    account.statement()
else:
    print("Account not found.")



print("\n===== Recursive Transaction Total =====")

print(
    "ACC001 Total Transactions:",
    registry.total_transactions("ACC001"),
    "ETB"
)



# Branch Tree

print("\n===== Branch Tree =====")


head_office = Branch("Head Office")

north_region = Branch("North Region")

south_region = Branch("South Region")

adama_branch = Branch("Adama Branch")

hawassa_branch = Branch("Hawassa Branch")


# Build tree

head_office.add_child(north_region)
head_office.add_child(south_region)

north_region.add_child(adama_branch)

south_region.add_child(hawassa_branch)



# Add accounts to branches

head_office.add_account(acc1)

north_region.add_account(acc2)

adama_branch.add_account(acc3)

south_region.add_account(acc4)

hawassa_branch.add_account(acc5)



print(
    "Total Bank Balance:",
    head_office.total_balance(),
    "ETB"
)



# BFS Graph Test

print("\n===== Transfer Network BFS =====")

reachable = bfs(
    transfers,
    "ACC001"
)

print("Accounts reachable from ACC001:")

for account in reachable:
    print(account)



# Undo transaction

print("\n===== Undo Last Transaction =====")

acc1.undo_last()

acc1.statement()



# Show all accounts

print("\n===== All Accounts =====")

registry.list_all()



# Singleton test

config1 = BankConfig()
config2 = BankConfig()

print(
    "\nSingleton Test:",
    config1 is config2
)
