import { FieldError } from 'react-hook-form';

/**
 * Used for password inputs
 * each keyword in the array is a rule the input field faild at, so we can give some visual
 * feedback for the user
 * @returns ['required', 'minlength', 'number' ...]
 */
export const formatValidationError = (validationErrors: {
    [key: string]: FieldError | undefined;
}) => {
    if (validationErrors?.password?.types) {
        return Object.entries(validationErrors?.password?.types).reduce(
            (acc: string[], rule) => {
                let validateResult = rule[1];

                if (typeof validateResult === 'boolean' || !validateResult) {
                    return acc;
                }

                if (typeof validateResult === 'string') {
                    return [...acc, validateResult];
                }

                return [...acc, ...validateResult];
            },
            [],
        );
    }

    return [];
};
