// Design a data validation pipeline for a user registration form. 
// A UserInput object has name, email, and age. 
// Validators should be composable — e.g. you should be able to stack TrimValidator, NonEmptyValidator, EmailFormatValidator, AgeRangeValidator in any order. 
// Each validator either passes the input through to the next or throws with a specific error message.

type UserInput = { name: string; email: string; age: number; };

interface Validator {
    validate(input: UserInput): UserInput;
}

class BaseValidator implements Validator {
    validate(input: UserInput): UserInput {
        return input;
    }
}

class NonEmptyValidator implements Validator {
    constructor(private inner: Validator) { }

    validate(input: UserInput): UserInput {
        const result = this.inner.validate(input);
        if (!result.name.trim()) throw new Error("Name cannot be empty");
        return result;
    }
}

// rest all validators in same way

const validator = new NonEmptyValidator(
    new BaseValidator()
)
validator.validate({ name: "Akul", email: "test@gmail.com", age: 30 })
