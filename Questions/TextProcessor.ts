// Design a TextProcessor that can apply transformations to a string — like trimming, uppercasing, or adding a prefix. Multiple transformations should be composable.

interface ITextProcessor {
    trim(): TextProcessor;
    toUpperCase(): TextProcessor;
    prefix(prefix: string): TextProcessor;
    getValue(): string;
}

class TextProcessor implements ITextProcessor {
    constructor(private readonly str: string) {}

    trim(): TextProcessor {
        return new TextProcessor(this.str.trim());
    }

    toUpperCase(): TextProcessor {
        return new TextProcessor(this.str.toUpperCase());
    }

    prefix(p: string): TextProcessor {
        return new TextProcessor(`${p}${this.str}`);
    }

    getValue(): string {
        return this.str;
    }
}

// Usage
const result = new TextProcessor("  hello  ")
    .trim()
    .toUpperCase()
    .prefix(">>> ")
    .getValue();

// Another approach becomes relevant when:
// Transformations need to be decided at runtime based on config/input — e.g. build a pipeline from a list of strings ["trim", "uppercase"]
// You need to add/remove transformations dynamically after the processor is built
// Transformations are complex enough to warrant their own class with their own state or dependencies
// For a straightforward "apply some string transformations" problem in an interview, the chaining approach is cleaner and faster to write. 
// The interviewer would only push you toward the second if they explicitly asked 
// "how would you make this extensible to new transformation types without modifying existing code" — that's your cue.

interface TextProcessor {
    process(input: string): string;
}

class PlainText implements TextProcessor {
    process(input: string): string { return input; }
}

class TrimProcessor implements TextProcessor {
    constructor(private inner: TextProcessor) {}
    process(input: string): string { return this.inner.process(input).trim(); }
}

class UpperCaseProcessor implements TextProcessor {
    constructor(private inner: TextProcessor) {}
    process(input: string): string { return this.inner.process(input).toUpperCase(); }
}

class PrefixProcessor implements TextProcessor {
    constructor(private inner: TextProcessor, private prefix: string) {}
    process(input: string): string { return `${this.prefix}${this.inner.process(input)}`; }
}

// Usage
const processor = new PrefixProcessor(
    new UpperCaseProcessor(
        new TrimProcessor(new PlainText())
    ), ">>> "
);
processor.process("  hello  ");
