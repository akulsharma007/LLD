// Q. Design a parking lot with three spot sizes. Different vehicles require different spot sizes. 
// Support parking and unparking by plate number. No type-checking conditionals.

// Follow up - The parking lot should support spot upgrades — if no spot of the required size is available, 
// the vehicle can be parked in the next larger size (e.g. a Car needing M can park in L if no M spots are free; 
// a Motorcycle needing S can park in M or L). The vehicle's required size doesn't change — only the assignment logic does.

enum Size { S, M, L }

interface Vehicle {
    getLicensePlate(): string;
    getRequiredSize(): Size;
}

class Motorcycle implements Vehicle {
    constructor(private plate: string) { }
    getLicensePlate(): string { return this.plate; }
    getRequiredSize(): Size { return Size.S; }
}

class Car implements Vehicle {
    constructor(private plate: string) { }
    getLicensePlate(): string { return this.plate; }
    getRequiredSize(): Size { return Size.M; }
}

class Truck implements Vehicle {
    constructor(private plate: string) { }
    getLicensePlate(): string { return this.plate; }
    getRequiredSize(): Size { return Size.L; }
}

class Slot {
    private occupiedBy: string | null = null;

    constructor(private readonly size: Size) { }

    getSize(): Size { return this.size; }
    isOccupied(): boolean { return this.occupiedBy !== null; }
    occupy(plate: string): void { this.occupiedBy = plate; }
    vacate(): void { this.occupiedBy = null; }
}

class ParkingLot {
    private slots: Slot[] = [];
    private parked: Map<string, Slot> = new Map();

    constructor(small: number, medium: number, large: number) {
        for (let i = 0; i < small; i++) this.slots.push(new Slot(Size.S));
        for (let i = 0; i < medium; i++) this.slots.push(new Slot(Size.M));
        for (let i = 0; i < large; i++) this.slots.push(new Slot(Size.L));
    }

    park(vehicle: Vehicle): void {
        const plate = vehicle.getLicensePlate();
        if (this.parked.has(plate)) throw new Error("Vehicle already parked");

        const acceptable = this.getAcceptableSizes(vehicle.getRequiredSize());

        for (const size of acceptable) {
            const slot = this.slots.find(s => s.getSize() === size && !s.isOccupied());
            if (slot) {
                slot.occupy(plate);
                this.parked.set(plate, slot);
                return;
            }
        }

        throw new Error("No available spots");
    }

    unpark(plate: string): void {
        const slot = this.parked.get(plate);
        if (!slot) throw new Error("Vehicle not found");
        slot.vacate();
        this.parked.delete(plate);
    }

    private getAcceptableSizes(required: Size): Size[] {
        return ([Size.S, Size.M, Size.L] as Size[]).filter(s => s >= required);
    }
}
