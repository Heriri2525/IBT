class Account:
    def __init__(self, owner, account_number, balance=0):
        self.owner = owner
        self.account_number = account_number
        self.__balance = balance

    # Get balance
    @property
    def balance(self):
        return self.__balance

    # Add money
    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("Deposit amount must be positive.")

        self.__balance += amount
        print(f"{amount} ETB deposited successfully.")

    # Remove money
    def withdraw(self, amount):
        if amount <= 0:
            raise ValueError("Withdrawal amount must be positive.")

        if amount > self.__balance:
            raise ValueError("Insufficient balance.")

        self.__balance -= amount
        print(f"{amount} ETB withdrawn successfully.")

    # Show account info
    def statement(self):
        print("\n===== Account =====")
        print(f"Owner          : {self.owner}")
        print(f"Account Number : {self.account_number}")
        print(f"Balance        : {self.balance} ETB")


# Savings account

class SavingsAccount(Account):
    def __init__(self, owner, account_number, balance=0, rate=0.05):
        super().__init__(owner, account_number, balance)
        self.rate = rate

    def add_interest(self):
        interest = self.balance * self.rate
        self.deposit(interest)

    def statement(self):
        print("\n===== Savings Account =====")
        print(f"Owner          : {self.owner}")
        print(f"Account Number : {self.account_number}")
        print(f"Interest Rate  : {self.rate * 100}%")
        print(f"Balance        : {self.balance:.2f} ETB")


# Current account

class CurrentAccount(Account):
    def __init__(self, owner, account_number, balance=0, overdraft=0):
        super().__init__(owner, account_number, balance)
        self.overdraft = overdraft

    def withdraw(self, amount):
        if amount <= 0:
            raise ValueError("Withdrawal amount must be positive.")

        if amount > self.balance + self.overdraft:
            raise ValueError("Overdraft limit exceeded.")

        # Change private balance
        self._Account__balance -= amount
        print(f"{amount} ETB withdrawn successfully.")

    def statement(self):
        print("\n===== Current Account =====")
        print(f"Owner          : {self.owner}")
        print(f"Account Number : {self.account_number}")
        print(f"Overdraft      : {self.overdraft} ETB")
        print(f"Balance        : {self.balance:.2f} ETB")


# Testing

account = Account("Hermela", "1001", 5000)

savings = SavingsAccount("Almaz", "1002", 4000, 0.10)
current = CurrentAccount("Dawit", "1003", 2000, 1000)


# Transactions

account.deposit(500)

savings.deposit(1000)
savings.add_interest()

current.withdraw(2500)


# Test different accounts

accounts = [account, savings, current]

print("\n===== Addis Bank Accounts =====")

for acc in accounts:
    acc.statement()
