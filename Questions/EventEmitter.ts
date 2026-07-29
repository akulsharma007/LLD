// Q3. Design an EventEmitter with on(event, handler), off(event, handler), and emit(event, data). Multiple handlers per event should be supported.

type Handler<T = unknown> = (data: T) => void;

interface IEventEmitter {
    on(event: string, handler: Handler): void;
    off(event: string, handler: Handler): void;
    emit(event: string, data: unknown): void;
}

class EventEmitter implements IEventEmitter {
    private handlers: Map<string, Handler[]> = new Map();

    on(event: string, handler: Handler): void {
        const existing = this.handlers.get(event) ?? [];
        this.handlers.set(event, [...existing, handler]);
    }

    off(event: string, handler: Handler): void {
        const existing = this.handlers.get(event);
        if (!existing) return;
        this.handlers.set(event, existing.filter(h => h !== handler));
    }

    emit(event: string, data: unknown): void {
        this.handlers.get(event)?.forEach(h => h(data));
    }
}

/* Follow up
Add a once(event, handler) method — the handler registers normally but automatically unregisters itself after being called the first time. 
No changes to emit internals should be needed to support this. */

type Handler<T = unknown> = (data: T) => void;

interface IEventEmitter {
    on(event: string, handler: Handler): void;
    off(event: string, handler: Handler): void;
    emit(event: string, data: unknown): void;
    once(event: string, handler: Handler): void;
}

class EventEmitter implements IEventEmitter {
    private handlers: Map<string, Handler[]> = new Map();

    on(event: string, handler: Handler): void {
        const existing = this.handlers.get(event) ?? [];
        this.handlers.set(event, [...existing, handler]);
    }

    off(event: string, handler: Handler): void {
        const existing = this.handlers.get(event);
        if (!existing) return;
        this.handlers.set(event, existing.filter(h => h !== handler));
    }

    emit(event: string, data: unknown): void {
        this.handlers.get(event)?.forEach(h => h(data));
    }

    once(event: string, handler: Handler): void {
        const wrapper: Handler = (data: unknown) => {
            handler(data)
            this.off(event, wrapper)
        }
        this.on(event, wrapper)
    }
}
