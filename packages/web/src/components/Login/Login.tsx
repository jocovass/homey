/** @jsxRuntime classic */
/** @jsx jsx */
// eslint-disable-next-line no-unused-vars
import { jsx, css, useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { GoChevronRight } from 'react-icons/go';

import { useAuth, login } from '../../context/authContext';
import { PrimaryButton } from '../ui/Buttons';
import { BtnLoader } from '../ui/BtnLoader';

const StyledLogin = styled.div`
    max-width: 650px;
    padding: 0 5vw;
    margin: 1.5rem auto 0;

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

interface FormElements extends HTMLFormControlsCollection {
    email: HTMLInputElement;
    password: HTMLInputElement;
}

interface LoginFormElement extends HTMLFormElement {
    readonly elements: FormElements;
}

export const Login = () => {
    const theme = useTheme();
    const {
        state: { user, status, errors, globalError },
        dispatch,
    } = useAuth();

    const isLoading = status === 'pending';
    const success = status === 'success';
    const isError = status === 'error';

    const handleSubmit = (e: React.FormEvent<LoginFormElement>) => {
        e.preventDefault();
        login(dispatch, {
            email: e.currentTarget.elements.email.value,
            password: e.currentTarget.elements.password.value,
        });
    };

    if (success) {
        return <Navigate to="/" replace />;
    }

    return (
        <StyledLogin>
            <div css={{ textAlign: 'center' }}>
                <h1>Log in</h1>
                <p
                    css={{
                        fontSize: '1.4rem',
                        marginBottom: '3.5rem',
                        color: theme.colors.greenGrey,
                    }}
                >
                    Welcome back, log in to see what is happening in your
                    household.
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                <div>
                    <div
                        css={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                        }}
                    >
                        <label htmlFor="email">Email</label>
                        {isError && errors?.email ? (
                            <p
                                css={{
                                    color: theme.colors.orangeRed,
                                    fontSize: '1.2rem',
                                }}
                            >
                                {errors.email}
                            </p>
                        ) : null}
                    </div>
                    <input
                        autoComplete="false"
                        type="email"
                        name="email"
                        id="email"
                        placeholder="test@gmail.com"
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
                        {isError && errors?.password ? (
                            <p
                                css={{
                                    color: theme.colors.orangeRed,
                                    fontSize: '1.2rem',
                                }}
                            >
                                {errors.password}
                            </p>
                        ) : null}
                    </div>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="********"
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
                        Log in
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
                        to="/register"
                    >
                        <span>Sign up here</span>
                        <GoChevronRight />
                    </Link>
                </div>

                {isError && globalError ? (
                    <div
                        css={{
                            color: theme.colors.orangeRed,
                            fontSize: '1.4rem',
                            marginTop: '1rem',
                        }}
                        className="error"
                    >
                        {globalError}
                    </div>
                ) : null}

                <div css={{ marginTop: '2rem' }}>
                    <Link
                        css={{
                            color: theme.colors.greenGrey,
                            fontSize: '1.1rem',
                            textDecoration: 'none',

                            '&:hover': {
                                textDecoration: 'underline',
                            },
                        }}
                        to="/reset-password"
                    >
                        Forgot your password?
                    </Link>
                </div>
            </form>
        </StyledLogin>
    );
};
