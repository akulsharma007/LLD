//Q5. Design a TrafficLight. It should transition through its cycle via a next() call and expose the current state. 
// Invalid manual state sets should be rejected.

/*Follow up:-
The traffic light should support different timing durations per state — RED stays for 60s, GREEN for 45s, YELLOW for 15s. 
Add a getDuration() method that returns the current state's duration. The transition logic should not change.
Once duration is added, state machine pattern shines */

enum Light {
    RED,
    GREEN,
    YELLOW
}

const transitions: Record<Light, Light> = {
    [Light.RED]:    Light.GREEN,
    [Light.GREEN]:  Light.YELLOW,
    [Light.YELLOW]: Light.RED,
};

const durations: Record<Light, number> = {
    [Light.RED]:    60,
    [Light.GREEN]:  45,
    [Light.YELLOW]: 15,
};

class TrafficLight {
    private light: Light = Light.RED;

    next(): void {
        this.light = transitions[this.light];
    }

    getLight(): string {
        return Light[this.light];
    }

    setLight(light: Light): void {
        if (transitions[this.light] !== light) {
            throw new Error(
                `Invalid transition: ${Light[this.light]} → ${Light[light]}`
            );
        }
        this.light = light;
    }

    getDuration(): number {
        return durations[this.light]
    }
}

// With state machine pattern - although its over engineered
interface TrafficLightState {
    next(light: TrafficLight): void;
    getLabel(): string;
    getDuration(): number;
}

class RedState implements TrafficLightState {
    next(light: TrafficLight): void {
        light.setState(new GreenState());
    }
    getLabel(): string { return "RED"; }
    getDuration(): number { return 60; }
}

class GreenState implements TrafficLightState {
    next(light: TrafficLight): void {
        light.setState(new YellowState());
    }
    getLabel(): string { return "GREEN"; }
    getDuration(): number { return 45; }
}

class YellowState implements TrafficLightState {
    next(light: TrafficLight): void {
        light.setState(new RedState());
    }
    getLabel(): string { return "YELLOW"; }
    getDuration(): number { return 15; }
}

class TrafficLight {
    private state: TrafficLightState = new RedState();

    setState(state: TrafficLightState): void {
        this.state = state;
    }

    next(): void {
        this.state.next(this);
    }

    getLight(): string {
        return this.state.getLabel();
    }

    getDuration(): number {
        return this.state.getDuration()
    }
}
