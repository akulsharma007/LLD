/* Q2. Design a Logger that can write to different outputs: console, file (simulate it), and a silent/no-op mode. 
The output target should be changeable after the logger is created. */

interface ILogger {
    log(message: string): void,
    info(message: string): void,
    error(message: string): void
}

interface LogOutput {
    write(message: string): void
}

class ConsoleOutput implements LogOutput {
    write(message: string): void {
        console.log(`console output write - ${message}`)
    }
}

class FileOutput implements LogOutput {
    write(message: string): void {
        console.log(`file output write simulate - ${message}`)
    }
}

class NoOpOutput implements LogOutput {
    write(message: string): void { }
}

class Logger implements ILogger {
    private output: LogOutput

    constructor(output: LogOutput) {
        this.output = output
    }

    log(message: string): void {
        this.output.write(`log :- ${message}`)
    }

    info(message: string): void {
        this.output.write(`info :- ${message}`)
    }

    error(message: string): void {
        this.output.write(`error :- ${message}`)
    }

    setOutput(output: LogOutput) {
        this.output = output
    }
}

// Usage
const consoleOutput = new ConsoleOutput()
const logger = new Logger(consoleOutput)
logger.log("test")
logger.setOutput(new FileOutput())

/* Follow Question -
Add log levels: DEBUG < INFO < WARN < ERROR. 
The logger should have a configurable minimum level — messages below it are silently ignored. 
E.g. if set to WARN, only WARN and ERROR messages get written. */

interface ILogger {
    debug(message: string): void,
    info(message: string): void,
    warn(message: string): void,
    error(message: string): void
}

interface LogOutput {
    write(message: string): void
}

enum Level {
    DEBUG,
    INFO,
    WARN,
    ERROR
}

class ConsoleOutput implements LogOutput {
    write(message: string): void {
        console.log(`console output write - ${message}`)
    }
}

class FileOutput implements LogOutput {
    write(message: string): void {
        console.log(`file output write simulate - ${message}`)
    }
}

class NoOpOutput implements LogOutput {
    write(message: string): void { }
}

class Logger implements ILogger {
    private output: LogOutput
    private level: Level

    constructor(output: LogOutput, level: Level) {
        this.output = output
        this.level = level
    }

    debug(message: string): void {
        this.write(Level.DEBUG, message);
    }

    info(message: string): void {
        this.write(Level.INFO, message);
    }

    warn(message: string): void {
        this.write(Level.WARN, message);
    }

    error(message: string): void {
        this.write(Level.ERROR, message);
    }

    setOutput(output: LogOutput) {
        this.output = output
    }

    getLevel(): Level {
        return this.level
    }

    setLevel(level: Level) {
        this.level = level
    }

    private canLog(from: Level): boolean {
        return this.level <= from
    }

    private write(level: Level, message: string): void {
        if (this.canLog(level)) {
            this.output.write(`[${Level[level]}] ${message}`);
        }
    }
}

/* Is there no need to add getLevel, setLevel, setOutput to ILogger interface, why?
ILogger describes what a logger does — it logs messages. That's the core capability consumers of the interface care about.
setLevel, setOutput, getLevel are configuration — they control how the logger is set up, not what it does as a logger. 
These belong to the concrete Logger class, not the interface.
The practical reason this matters: if you had multiple logger implementations (Logger, CloudLogger, StructuredLogger), they might configure themselves completely differently. 
CloudLogger might not even have a swappable output — it always writes to a cloud endpoint. 
Forcing setOutput onto ILogger would mean every implementation has to satisfy a configuration contract that may not make sense for them.
Rule of thumb: put on the interface only what the caller needs to depend on. Configuration is usually the owner's concern, not the caller's.*/
