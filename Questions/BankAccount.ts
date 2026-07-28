// Q1. Design a BankAccount class. It should support deposit, withdraw, and getBalance. Negative amounts and overdrafts should be rejected.
interface Account {
    /*Why void instead of returning balance?
    Returning balance from deposit/withdraw implies the caller should use that return value to track state — but state lives inside the object. 
    If they need the balance, they call getBalance(). 
    Returning it from mutating methods creates ambiguity about what the source of truth is that is why deposit and withdraw should return void.*/
    deposit(amount: number): void;
    withdraw(amount: number): void;
    getBalance(): number;
}

class BankAccount implements Account {
    private balance: number;

    constructor(initialBalance: number = 0) {
        if (initialBalance < 0) {
            throw new Error("Initial balance cannot be negative");
        }
        this.balance = initialBalance;
    }

    getBalance(): number {
        return this.balance;
    }

    deposit(amount: number): void {
        if (amount <= 0) {
            throw new Error("Deposit amount must be positive");
        }
        this.balance += amount;
    }

    withdraw(amount: number): void {
        if (amount <= 0) {
            throw new Error("Withdrawal amount must be positive");
        }
        if (amount > this.balance) {
            throw new Error("Insufficient funds");
        }
        this.balance -= amount;
    }
}

/*Follow-up question:-
Add a TransactionHistory feature. 
Each deposit and withdrawal should be recorded with the amount, type (DEPOSIT/WITHDRAWAL), and resulting balance. Add a getHistory() method. 
Make sure the history cannot be mutated from outside the class.*/

enum TransactionType {
    Deposit = "DEPOSIT",
    Withdraw = "WITHDRAW"
}

type TransactionRecord = {
    transactionType: TransactionType;
    amount: number;
    balance: number;
}

interface Account {
    deposit(amount: number): void;
    withdraw(amount: number): void;
    getBalance(): number;
    getHistory(): TransactionRecord[]
}

class BankAccount implements Account {
    private balance: number;
    private history: TransactionRecord[]

    constructor() {
        this.balance = 0;
        this.history = []
    }

    getBalance(): number {
        return this.balance;
    }

    deposit(amount: number): void {
        if (amount <= 0) {
            throw new Error("Deposit amount must be positive");
        }
        this.balance += amount;
        this.recordTransaction(TransactionType.Deposit, amount)
    }

    withdraw(amount: number): void {
        if (amount <= 0) {
            throw new Error("Withdrawal amount must be positive");
        }
        if (amount > this.balance) {
            throw new Error("Insufficient funds");
        }
        this.balance -= amount;
        this.recordTransaction(TransactionType.Withdraw, amount)
    }

    getHistory(): TransactionRecord[] {
        // Note - returning shallow copy from here so that it can not be mutated from outside. Also, in case of nested objects use .map to return a shallow copy
        return [...this.history]
    }

    private recordTransaction(transactionType: TransactionType, amount: number) {
        this.history.push({
            transactionType: transactionType,
            amount: amount,
            balance: this.balance
        })
    }
}
