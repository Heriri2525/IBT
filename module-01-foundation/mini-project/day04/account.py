class Account:
    def __init__(self, owner, account_number, balance=0):
        self.owner = owner
        self.account_number = account_number
        self.__balance = balance

    # Get balance
    @property
    def balance(self):
        return self.__balance

    # Deposit
    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("Deposit amount must be positive.")

        self.__balance += amount
        print(f"{amount} ETB deposited successfully.")

    # Withdraw
    def withdraw(self, amount):
        if amount <= 0:
            raise ValueError("Withdrawal amount must be positive.")

        if amount > self.__balance:
            raise ValueError("Insufficient balance.")

        self.__balance -= amount
        print(f"{amount} ETB withdrawn successfully.")

    # Show account details
    def statement(self):
        print("\n===== Account Statement =====")
        print(f"Owner          : {self.owner}")
        print(f"Account Number : {self.account_number}")
        print(f"Balance        : {self.__balance} ETB")


# Test account

account1 = Account("Hermela", "1001", 5000)
account2 = Account("Almaz", "1002", 2000)


# Transactions

account1.deposit(1000)
account1.withdraw(2000)

account2.deposit(500)


# Display accounts

account1.statement()
account2.statement()


# Access balance

print(f"\nHermela's Balance: {account1.balance} ETB")


# Error examples

try:
    account1.deposit(-500)
except ValueError as error:
    print("\nError:", error)

try:
    account2.withdraw(5000)
except ValueError as error:
    print("Error:", error)
