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
        sms:   () => new SMS(),
        push:  () => new Push(),
    };

    static create(type: string): Channel {
        const factory = this.registry[type.toLowerCase()];
        if (!factory) throw new Error(`Unknown channel: ${type}`);
        return factory();
    }
}

class Notification {
    constructor(private channel: Channel) {}

    send(message: string): void {
        this.channel.send(message);
    }
}

// Usage
const notification = new Notification(NotificationFactory.create("email"));
notification.send("Hello!");
