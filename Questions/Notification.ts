// Q4. Design a system that can send notifications via Email, SMS, or Push. The caller should not need to know which type they're creating — they just specify the channel.
interface Channel {
    send(message: string): void;
}

class Email implements Channel {
    send(message: string): void { /* send email */ }
}

class SMS implements Channel {
    send(message: string): void { /* send sms */ }
}

class Push implements Channel {
    send(message: string): void { /* send push */ }
}

class NotificationFactory {
    private static readonly registry: Record<string, () => Channel> = {
        email: () => new Email(),
        sms: () => new SMS(),
        push: () => new Push(),
    };

    static create(type: string): Channel {
        const factory = this.registry[type.toLowerCase()];
        if (!factory) throw new Error(`Unknown channel: ${type}`);
        return factory();
    }
}

class Notification {
    constructor(private channel: Channel) { }

    send(message: string): void {
        this.channel.send(message);
    }
}

// Usage
const notification = new Notification(NotificationFactory.create("email"));
notification.send("Hello!");

/* The system should support sending the same notification through multiple channels simultaneously — e.g. send via both Email and SMS at once.
Caller still just calls send(message) once. Modify the minimum amount of code to support this. */

interface Channel {
    send(message: string): void;
}

class Email implements Channel {
    send(message: string): void { /* send email */ }
}

class SMS implements Channel {
    send(message: string): void { /* send sms */ }
}

class Push implements Channel {
    send(message: string): void { /* send push */ }
}

class MultiChannel implements Channel {
    constructor(private channels: Channel[]) { }

    send(message: string): void {
        this.channels.forEach(c => c.send(message));
    }
}

class NotificationFactory {
    private static readonly registry: Record<string, () => Channel> = {
        email: () => new Email(),
        sms: () => new SMS(),
        push: () => new Push(),
    };

    static create(type: string): Channel {
        const factory = this.registry[type.toLowerCase()];
        if (!factory) throw new Error(`Unknown channel: ${type}`);
        return factory();
    }
}

class Notification {
    constructor(private channel: Channel) { }

    send(message: string): void {
        this.channel.send(message);
    }
}

// Usage — Notification doesn't change at all
const notification = new Notification(
    new MultiChannel([
        NotificationFactory.create("email"),
        NotificationFactory.create("sms")
    ])
);
notification.send("Hello!");

// Or just have move the multi channel implementation inside Notification, both works
