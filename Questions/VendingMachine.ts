// Q6 Design a vending machine that handles: inserting coins, selecting a product, 
// dispensing, and returning change. Handle invalid transitions gracefully.

// Follow up (only for state machine solution):-
// Add products to the vending machine. Each product has a name and a price. 
// When inserting a coin, the user specifies the amount. 
// When selecting a product, validate that enough coins have been inserted. 
// On dispense, return the product and calculate change. If insufficient funds, reject the selection.

enum State {
    INSERT_COIN,
    SELECT_PRODUCT,
    DISPENSE
}

const transitions: Record<State, State> = {
    [State.INSERT_COIN]: State.SELECT_PRODUCT,
    [State.SELECT_PRODUCT]: State.DISPENSE,
    [State.DISPENSE]: State.INSERT_COIN,
};

class VendingMachine1 {
    private state: State = State.INSERT_COIN;

    insertCoin() {
        this.setState(State.INSERT_COIN)
    }

    selectProduct() {
        this.setState(State.SELECT_PRODUCT)
    }

    dispense() {
        this.setState(State.DISPENSE)
    }

    setState(state: State) {
        if (transitions[this.state] !== state) {
            throw new Error("Invalid state")
        }
        this.state = state
    }
}



//State machine pattern
interface VendingMachineState {
    insertCoin(machine: VendingMachine, amount: number): void
    selectProduct(machine: VendingMachine, product: string): void
    dispense(machine: VendingMachine): number
}

class InsertCoinState implements VendingMachineState {
    insertCoin(machine: VendingMachine, amount: number): void {
        machine.setState(new SelectProductState())
        machine.setAmount(amount)
    }
    selectProduct(machine: VendingMachine, product: string): void {
        throw new Error("Insert coin first")
    }
    dispense(machine: VendingMachine): number {
        throw new Error("Insert coin first and then select product to dispense")
    }
}

class SelectProductState implements VendingMachineState {
    insertCoin(machine: VendingMachine, amount: number): void {
        throw new Error("Coin already inserted")
    }
    selectProduct(machine: VendingMachine, product: string): void {
        const price = machine.getProductPrice(product);
        if (!price) throw new Error("Product not available");
        if (machine.getAmount() < price) throw new Error("Insufficient funds");
        machine.setProduct(product);
        machine.setState(new DispenseState());
    }
    dispense(machine: VendingMachine): number {
        throw new Error("Select product to dispense")
    }
}

class DispenseState implements VendingMachineState {
    insertCoin(machine: VendingMachine, amount: number): void {
        throw new Error("Coin already inserted")
    }
    selectProduct(machine: VendingMachine, product: string): void {
        throw new Error("Already selected")
    }
    dispense(machine: VendingMachine): number {
        const productPrice = machine.getProductPrice(machine.getProduct())!
        let change = 0
        if (productPrice <= machine.getAmount()) {
            change = machine.getAmount() - productPrice
            machine.setAmount(0);
        } else {
            throw new Error("You are short on amount")
        }
        machine.setState(new InsertCoinState())
        machine.setProduct("");
        machine.setAmount(0);
        return change
    }
}

class VendingMachine {
    private state: VendingMachineState = new InsertCoinState()
    private amount: number = 0
    private product: string = ""
    private inventory: Record<string, number> = {
        "prod1": 1,
        "prod2": 2
    };

    getProductPrice(product: string): number | undefined {
        return this.inventory[product];
    }

    setState(state: VendingMachineState): void {
        this.state = state
    }

    setAmount(amount: number) {
        this.amount = amount
    }

    getAmount() {
        return this.amount
    }

    setProduct(product: string) {
        this.product = product
    }

    getProduct() {
        return this.product
    }

    insertCoin(amount: number) {
        this.state.insertCoin(this, amount)
    }

    selectProduct(product: string) {
        this.state.selectProduct(this, product)
    }

    dispense(): number {
        return this.state.dispense(this)
    }
}

