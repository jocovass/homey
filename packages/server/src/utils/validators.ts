import { Request, Response, NextFunction } from 'express';
import { body, validationResult, param } from 'express-validator';

/////////////////////////////////////
// Rules
export const simpleField = (fieldName: string | string[]) =>
    body(fieldName)
        .trim()
        .not()
        .isEmpty()
        .withMessage('Field is required')
        .escape();

export const email = (fieldName = 'email') =>
    body(fieldName)
        .trim()
        .not()
        .isEmpty()
        .withMessage('Field is required.')
        .escape()
        .isEmail()
        .withMessage('Invalid email address')
        .normalizeEmail({ gmail_remove_dots: false, gmail_lowercase: true });

export const password = (fieldName: string | string[] = 'password') =>
    body(fieldName)
        .trim()
        .not()
        .isEmpty()
        .withMessage('Field is required.')
        .escape();
// .isStrongPassword()
// .withMessage('Password is weak.'),

export const comparePassword = (
    fieldName = 'password',
    compareTo = 'passwordConfirm',
) =>
    body(fieldName)
        .trim()
        .not()
        .isEmpty()
        .withMessage('Field is required.')
        .escape()
        .custom((val, { req }) => {
            if (val !== req.body[compareTo])
                throw new Error(
                    'Password confirmation does not match password.',
                );

            return true;
        });

export const checkParams = (paramName: string | string[]) =>
    param(paramName)
        .trim()
        .not()
        .isEmpty()
        .withMessage(`${paramName} is required, did you forget?`);

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
