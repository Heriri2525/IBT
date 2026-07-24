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


# Main account class

class Account:
    def __init__(self, owner, account_number, balance=0):
        self.owner = owner
        self.account_number = account_number
        self.__balance = balance
        self._observers = []
        self.history = []      # Stack

    @property
    def balance(self):
        return self.__balance

    def _set_balance(self, amount):
        self.__balance = amount

    # Add observers
    def subscribe(self, observer):
        self._observers.append(observer)

    # Send alerts
    def _notify(self, message):
        for observer in self._observers:
            observer.update(message)

    # Deposit
    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("Deposit amount must be positive.")

        self._set_balance(self.balance + amount)
        self.history.append(("deposit", amount))
        self._notify(f"{self.owner} deposited {amount} ETB")

    # Withdraw
    def withdraw(self, amount):
        if amount <= 0:
            raise ValueError("Withdrawal amount must be positive.")

        if amount > self.balance:
            raise ValueError("Insufficient balance.")

        self._set_balance(self.balance - amount)
        self.history.append(("withdraw", amount))
        self._notify(f"{self.owner} withdrew {amount} ETB")

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
        print("\n Account ")
        print(f"Owner: {self.owner}")
        print(f"Account Number: {self.account_number}")
        print(f"Balance: {self.balance:.2f} ETB")


# Savings account

class SavingsAccount(Account):
    def __init__(self, owner, account_number, balance=0):
        super().__init__(owner, account_number, balance)
        self.rate = config.interest_rate

    def add_interest(self):
        self.deposit(self.balance * self.rate)

    def statement(self):
        print("\n Savings Account ")
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
        self.history.append(("withdraw", amount))
        self._notify(f"{self.owner} withdrew {amount} ETB")

    def statement(self):
        print("\nCurrent Account ")
        print(f"Owner: {self.owner}")
        print(f"Account Number: {self.account_number}")
        print(f"Overdraft: {self.overdraft} ETB")
        print(f"Balance: {self.balance:.2f} ETB")


# Factory

class AccountFactory:

    @staticmethod
    def create(kind, owner, account_number, balance=0):

        if kind.lower() == "savings":
            return SavingsAccount(owner, account_number, balance)

        elif kind.lower() == "current":
            return CurrentAccount(owner, account_number, balance)

        else:
            raise ValueError("Invalid account type.")


# Registry

class AccountRegistry:

    def __init__(self):
        self.accounts = {}

    # Add account
    def add(self, account):
        self.accounts[account.account_number] = account

    # O(1) lookup
    def find(self, account_number):
        return self.accounts.get(account_number)

    # List all accounts
    def list_all(self):
        for number in sorted(self.accounts):
            self.accounts[number].statement()


# Test

sms = SMSAlert()
audit = AuditLog()

registry = AccountRegistry()

acc1 = AccountFactory.create("savings", "Hermela", "ACC001", 5000)
acc2 = AccountFactory.create("current", "Almaz", "ACC002", 3000)

acc1.subscribe(sms)
acc1.subscribe(audit)

acc2.subscribe(sms)
acc2.subscribe(audit)

registry.add(acc1)
registry.add(acc2)

acc1.deposit(1000)
acc1.add_interest()

acc2.withdraw(3500)

print("\n Find Account ")
account = registry.find("ACC001")
account.statement()

print("\n Undo Transaction ")
acc1.undo_last()
acc1.statement()

print("\n All Accounts ")
registry.list_all()

config1 = BankConfig()
config2 = BankConfig()

print("\nSingleton Test:", config1 is config2)
