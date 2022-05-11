import * as yup from 'yup';

export const nameSchema = yup.object({
    firstName: yup.string().required('First name is required.'),
    lastName: yup.string().required('Last name is required.'),
});

export const emailSchame = yup.object({
    email: yup
        .string()
        .required('Email is required.')
        .email('Invalid email address.'),
});

export const passSchemaOne = yup.object({
    password: yup
        .string()
        .required('Password is required.')
        .min(8, 'Must be 8 characters minimum.'),
});

export const passSchemaTwo = yup.object({
    password: yup
        .string()
        .required('required')
        .min(8, '8 characters minimum')
        .matches(RegExp('(.*[a-z].*)'), 'One lowercase character')
        .matches(RegExp('(.*[A-Z].*)'), 'One uppercase character')
        .matches(RegExp('(.*\\d.*)'), 'One number')
        .matches(RegExp('[!@#$%^&*(),.?":{}|<>]'), 'One special character'),
});

export const passConfirmSchema = yup.object({
    passwordConfirm: yup
        .string()
        .required('Password confirmation is required.')
        .oneOf([yup.ref('password')], 'Password must match.'),
});

export const signupSchema = nameSchema
    .concat(emailSchame)
    .concat(passSchemaTwo)
    .concat(passConfirmSchema);

export const loginSchema = emailSchame.concat(passSchemaOne);

export const updatePasswordSchema = yup
    .object({
        currentPassword: yup.string().required('Current password is required.'),
    })
    .concat(passSchemaTwo)
    .concat(passConfirmSchema);

export const passwordValidationList = [
    'One lowercase character',
    'One uppercase character',
    'One number',
    'One special character',
    '8 characters minimum',
];

// Validate fily type
export function validateFileTypes(files?: FileList): boolean {
    let valid = true;
    if (files) {
        Array.from(files).forEach(file => {
            if (
                ![
                    'image/jpg',
                    'image/jpeg',
                    'image/png',
                    'image/svg+xml',
                ].includes(file.type)
            ) {
                valid = false;
            }
        });
    }
    return valid;
}
