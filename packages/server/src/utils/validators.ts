import { Request, Response, NextFunction } from 'express';
import { body, validationResult, ValidationChain } from 'express-validator';

/////////////////////////////////////
// Rules
type Rules = { [k: string]: ValidationChain };
const rules: Rules = {
    firstName: body('firstName')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Field is required')
        .escape(),
    lastName: body('lastName')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Field is required')
        .escape(),
    email: body('email')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Field is required.')
        .escape()
        .isEmail()
        .withMessage('Invalid email address')
        .normalizeEmail({ gmail_remove_dots: false, gmail_lowercase: true }),
    password: body('password')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Field is required.')
        .escape(),
    // .isStrongPassword()
    // .withMessage('Password is weak.'),
    newPassword: body('newPassword')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Field is required.')
        .escape(),
    // .isStrongPassword()
    // .withMessage('Password is weak.'),
    passwordConfirm: body('passwordConfirm')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Field is required.')
        .escape()
        .custom((val, { req }) => {
            if (val !== req.body.password)
                throw new Error(
                    'Password confirmation does not match password.',
                );

            return true;
        }),
    newPasswordConfirm: body('newPasswordConfirm')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Field is required.')
        .escape()
        .custom((val, { req }) => {
            if (val !== req.body.newPassword)
                throw new Error(
                    'Password confirmation does not match password.',
                );

            return true;
        }),
};

/////////////////////////////////////
// Generate rules based on the inserted fields
export const generateRules = (...fields: string[]) => {
    if (!fields.length) return [];

    const validators = [];

    for (const field of fields) {
        validators.push(rules[field]);
    }

    return validators;
};

/////////////////////////////////////
// If there is a validation error send it to the client
export const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) return next();

    const formatedErrors = errors.array().map(error => {
        return { [error.param]: error.msg };
    });

    return res.status(422).json({ errors: formatedErrors });
};
