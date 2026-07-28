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
