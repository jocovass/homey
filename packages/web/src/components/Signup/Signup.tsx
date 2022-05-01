/** @jsxRuntime classic */
/** @jsx jsx */
// eslint-disable-next-line no-unused-vars
import { jsx, css, useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { GoChevronRight } from 'react-icons/go';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { useUser } from '../../context/userContext';
import { login } from '../../services/authService';
import { formatValidationError } from '../../util/utils';
import { PrimaryButton } from '../ui/Buttons';
import { BtnLoader } from '../ui/BtnLoader';

const StyledSignup = styled.div`
    max-width: 650px;
    padding: 0 5vw;
    margin: 1.5rem auto 3rem;

    h1 {
        color: ${props => props.theme.colors.greenDark};
        font-size: 2.45rem;
        font-weight: 500;
        margin-bottom: 0.6rem;
    }

    label {
        display: block;
        font-size: 1.6rem;
        margin-bottom: 0.85rem;
    }

    input {
        width: 100%;
        min-height: 5.5rem;
        margin-bottom: 2rem;
        padding: 1.2rem;
        border-radius: 7px;
        border: 0;
        outline: 0;
        background-color: ${props => props.theme.colors.greenLight};
        font-size: 1.5rem;
        color: ${props => props.theme.colors.greenBlack};
        display: block;
        position: relative;
        transition-property: box-shadow;
        transition-duration: 300ms;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);

        &::placeholder {
            color: ${props => props.theme.colors.greenGrey};
        }

        &:hover,
        &:focus {
            box-shadow: ${props =>
                `0 0 0 2px ${props.theme.colors.greenLighter}, 0 0 0 4px ${props.theme.colors.greenAccent}`};
        }

        &.error:hover,
        &.error:focus {
            box-shadow: ${props =>
                `0 0 0 2px ${props.theme.colors.greenLighter}, 0 0 0 4px ${props.theme.colors.orangeRed}`};
        }
    }
`;

const StyledPasswordRequirements = styled.div`
    font-size: 1.3rem;
    color: #949494;
    margin-bottom: 2rem;

    &.error {
        color: ${props => props.theme.colors.orangeRed};
    }

    ul {
        display: flex;
        flex-wrap: wrap;
        padding-left: 1rem;
    }

    li {
        flex-basis: 100%;
        list-style-type: none;
        margin-bottom: 0.3rem;

        &.valid {
            color: ${props => props.theme.colors.greenAccent};
        }

        @media ${props => props.theme.mq.mobile} {
            flex-basis: 40%;
        }
    }
`;

interface IFormInputs {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    passwordConfirm: string;
}

const schema = yup.object({
    email: yup
        .string()
        .required('Email is required.')
        .email('Invalid email address.'),
    password: yup
        .string()
        .required('required')
        .min(8, 'minlength')
        .matches(RegExp('(.*[a-z].*)'), 'lowercase')
        .matches(RegExp('(.*[A-Z].*)'), 'uppercase')
        .matches(RegExp('(.*\\d.*)'), 'number')
        .matches(RegExp('[!@#$%^&*(),.?":{}|<>]'), 'special'),
});

export const Signup = () => {
    const theme = useTheme();
    const [{ status, error }, setState] = React.useState<{
        status: 'idle' | 'pending' | 'success' | 'error';
        error: string | null;
    }>({
        status: 'idle',
        error: null,
    });
    const {
        state: { user },
        dispatch,
    } = useUser();
    const {
        register,
        handleSubmit,
        setError: setValidationError,
        formState: { errors: validationErrors, isDirty },
    } = useForm<IFormInputs>({
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            passwordConfirm: '',
        },
        resolver: yupResolver(schema, { abortEarly: false }),
        mode: 'onBlur',
        reValidateMode: 'onChange',
        criteriaMode: 'all',
    });

    const isLoading = status === 'pending';
    const isSuccess = status === 'success';
    const isError = status === 'error';

    const onSubmit = (data: IFormInputs) => {
        setState({ status: 'pending', error: null });
        login({
            email: data.email,
            password: data.password,
            dispatch,
        })
            .then(() => setState({ error: null, status: 'success' }))
            .catch((error: any) => {
                if (typeof error.message === 'string') {
                    setState({
                        status: 'error',
                        error: error.message,
                    });

                    return;
                }

                error.errors.forEach(
                    (error: { [key: string]: string }, index: number) => {
                        let keys = Object.keys(error);
                        setValidationError(
                            keys[0] as 'email' | 'password',
                            {
                                type: 'custom',
                                message: error[keys[0]],
                            },
                            { shouldFocus: index === 0 },
                        );
                    },
                );

                setState({
                    status: 'error',
                    error: null,
                });
            });
    };

    const passwordErrors = formatValidationError(validationErrors);

    if (user && isSuccess) {
        return <Navigate to="/" replace />;
    }

    return (
        <StyledSignup>
            <div css={{ textAlign: 'center' }}>
                <h1>Sign up</h1>
                <p
                    css={{
                        fontSize: '1.4rem',
                        marginBottom: '3.5rem',
                        color: theme.colors.greenGrey,
                    }}
                >
                    Welcome, sign up and join a household or create your own.
                </p>
            </div>

            <pre>isDirty: {isDirty ? 'yes' : 'no'}</pre>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <div
                        css={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                        }}
                    >
                        <label htmlFor="firstName">First name</label>
                        {validationErrors?.firstName ? (
                            <p
                                css={{
                                    color: theme.colors.orangeRed,
                                    fontSize: '1.2rem',
                                }}
                            >
                                {validationErrors.firstName.message}
                            </p>
                        ) : null}
                    </div>
                    <input
                        autoComplete="false"
                        type="text"
                        id="firstName"
                        className={validationErrors?.firstName ? 'error' : ''}
                        placeholder="Jhon"
                        {...register('firstName')}
                    />
                </div>

                <div>
                    <div
                        css={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                        }}
                    >
                        <label htmlFor="lastName">Last name</label>
                        {validationErrors?.lastName ? (
                            <p
                                css={{
                                    color: theme.colors.orangeRed,
                                    fontSize: '1.2rem',
                                }}
                            >
                                {validationErrors.lastName.message}
                            </p>
                        ) : null}
                    </div>
                    <input
                        autoComplete="false"
                        type="text"
                        id="lastName"
                        className={validationErrors?.lastName ? 'error' : ''}
                        placeholder="Jhon"
                        {...register('lastName')}
                    />
                </div>

                <div>
                    <div
                        css={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                        }}
                    >
                        <label htmlFor="email">Email</label>
                        {validationErrors?.email ? (
                            <p
                                css={{
                                    color: theme.colors.orangeRed,
                                    fontSize: '1.2rem',
                                }}
                            >
                                {validationErrors.email.message}
                            </p>
                        ) : null}
                    </div>
                    <input
                        autoComplete="false"
                        type="email"
                        id="email"
                        className={validationErrors?.email ? 'error' : ''}
                        placeholder="test@gmail.com"
                        {...register('email')}
                    />
                </div>

                <div>
                    <div
                        css={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                        }}
                    >
                        <label htmlFor="password">Password</label>
                        {validationErrors?.password ? (
                            <p
                                css={{
                                    color: theme.colors.orangeRed,
                                    fontSize: '1.2rem',
                                }}
                            >
                                {validationErrors.password.message}
                            </p>
                        ) : null}
                    </div>
                    <input
                        type="password"
                        id="password"
                        placeholder="********"
                        className={validationErrors?.password ? 'error' : ''}
                        {...register('password')}
                    />
                </div>

                <StyledPasswordRequirements>
                    <ul>
                        <li
                            className={
                                passwordErrors.includes('lowercase')
                                    ? ''
                                    : 'valid'
                            }
                        >
                            One lowercase character
                        </li>
                        <li
                            className={
                                passwordErrors.includes('uppercase')
                                    ? ''
                                    : 'valid'
                            }
                        >
                            One uppercase character
                        </li>
                        <li
                            className={
                                passwordErrors.includes('number') ? '' : 'valid'
                            }
                        >
                            One number
                        </li>
                        <li
                            className={
                                passwordErrors.includes('special')
                                    ? ''
                                    : 'valid'
                            }
                        >
                            One special character
                        </li>
                        <li
                            className={
                                passwordErrors.includes('minlength')
                                    ? ''
                                    : 'valid'
                            }
                        >
                            8 characters minimum
                        </li>
                    </ul>
                </StyledPasswordRequirements>

                <div>
                    <div
                        css={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                        }}
                    >
                        <label htmlFor="passwordConfirm">
                            Confirm Password
                        </label>
                        {validationErrors?.passwordConfirm ? (
                            <p
                                css={{
                                    color: theme.colors.orangeRed,
                                    fontSize: '1.2rem',
                                }}
                            >
                                {validationErrors.passwordConfirm.message}
                            </p>
                        ) : null}
                    </div>
                    <input
                        type="password"
                        id="passwordConfirm"
                        placeholder="********"
                        className={
                            validationErrors?.passwordConfirm ? 'error' : ''
                        }
                        {...register('passwordConfirm')}
                    />
                </div>

                <div
                    css={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <PrimaryButton
                        css={{
                            padding: '.9em',
                            width: '15rem',

                            '&:disabled': {
                                cursor: 'not-allowed',
                                opacity: '0.5',
                            },
                        }}
                        disabled={isLoading}
                    >
                        Sign up
                        {isLoading ? <BtnLoader /> : null}
                    </PrimaryButton>

                    <span
                        css={{
                            fontSize: '2rem',
                            textTransform: 'uppercase',
                            color: theme.colors.greenGrey,
                        }}
                    >
                        or
                    </span>

                    <Link
                        css={{
                            color: theme.colors.greenDark,
                            fontSize: '1.2rem',
                            display: 'flex',
                            alignItems: 'center',
                            textDecoration: 'none',

                            span: {
                                transform: 'translateX(0)',
                                transitionProperty: 'transform',
                                transitionDuration: '300ms',
                                transitionTimingFunction:
                                    'cubic-bezier(0.4, 0, 0.2, 1)',
                            },

                            svg: {
                                transform: 'scale(0) translateX(20px)',
                                opacity: 0,
                                transitionProperty: 'transform opacity',
                                transitionDuration: '300ms',
                                transitionTimingFunction:
                                    'cubic-bezier(0.4, 0, 0.2, 1)',
                            },

                            '&:hover span': {
                                transform: 'translateX(-2px)',
                            },

                            '&:hover svg': {
                                transform: 'scale(1) translateX(0px)',
                                opacity: 1,
                            },
                        }}
                        to="/login"
                    >
                        <span>Log in here</span>
                        <GoChevronRight />
                    </Link>
                </div>

                {isError ? (
                    <div
                        css={{
                            color: theme.colors.orangeRed,
                            fontSize: '1.4rem',
                            marginTop: '1rem',
                        }}
                        className="error"
                    >
                        {error}
                    </div>
                ) : null}
            </form>
        </StyledSignup>
    );
};
