// Q7 Design a simple ATM machine. A user must insert their card, enter a PIN, and then can either withdraw or check balance. 
// After any operation, the card is ejected and the machine resets. Invalid operations in the wrong order should be rejected gracefully.

interface ATMState {
    insertCard(machine: ATM): void;
    enterPin(machine: ATM, pin: number): void;
    withdraw(machine: ATM, amount: number): void;
    checkBalance(machine: ATM): number;
    eject(machine: ATM): void;
}

class IdleState implements ATMState {
    insertCard(machine: ATM): void {
        console.log("Card inserted");
        machine.setState(new EnterPinState());
    }
    enterPin(machine: ATM, pin: number): void { throw new Error("Insert card first"); }
    withdraw(machine: ATM, amount: number): void { throw new Error("Insert card first"); }
    checkBalance(machine: ATM): number { throw new Error("Insert card first"); }
    eject(machine: ATM): void { throw new Error("No card inserted"); }
}

class EnterPinState implements ATMState {
    private static readonly VALID_PIN = 1234;

    insertCard(machine: ATM): void { throw new Error("Card already inserted"); }
    enterPin(machine: ATM, pin: number): void {
        if (pin !== EnterPinState.VALID_PIN) throw new Error("Invalid PIN");
        machine.setState(new AuthenticatedState());
    }
    withdraw(machine: ATM, amount: number): void { throw new Error("Enter PIN first"); }
    checkBalance(machine: ATM): number { throw new Error("Enter PIN first"); }
    eject(machine: ATM): void {
        console.log("Card ejected");
        machine.setState(new IdleState());
    }
}

class AuthenticatedState implements ATMState {
    insertCard(machine: ATM): void { throw new Error("Session in progress"); }
    enterPin(machine: ATM, pin: number): void { throw new Error("Already authenticated"); }
    withdraw(machine: ATM, amount: number): void {
        if (amount > machine.getBalance()) throw new Error("Insufficient funds");
        machine.setBalance(machine.getBalance() - amount);
        console.log(`Dispensing ${amount}`);
        machine.setState(new IdleState());
    }
    checkBalance(machine: ATM): number {
        const balance = machine.getBalance();
        machine.setState(new IdleState());
        return balance;
    }
    eject(machine: ATM): void {
        console.log("Card ejected");
        machine.setState(new IdleState());
    }
}

class ATM {
    private state: ATMState = new IdleState();
    private balance: number;

    constructor(initialBalance: number) {
        this.balance = initialBalance;
    }

    setState(state: ATMState): void { this.state = state; }
    getBalance(): number { return this.balance; }
    setBalance(amount: number): void { this.balance = amount; }

    insertCard(): void { this.state.insertCard(this); }
    enterPin(pin: number): void { this.state.enterPin(this, pin); }
    withdraw(amount: number): void { this.state.withdraw(this, amount); }
    checkBalance(): number { return this.state.checkBalance(this); }
    eject(): void { this.state.eject(this); }
}
