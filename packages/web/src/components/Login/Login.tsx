/** @jsxRuntime classic */
/** @jsx jsx */
// eslint-disable-next-line no-unused-vars
import { jsx, css, useTheme } from '@emotion/react';
import React from 'react';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import { GoChevronRight } from 'react-icons/go';

import axios from '../../util/axios';
import { PrimaryButton } from '../Elements/Buttons';
import { BtnLoader } from '../Elements/BtnLoader';

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
    const [loading, setLoading] = React.useState(false);

    const handleSubmit = (e: React.FormEvent<LoginFormElement>) => {
        e.preventDefault();
        // console.log(e.currentTarget.elements.email.value);
        // console.log(e.currentTarget.elements.password.value);
        // axios
        //     .post('/users/login', {
        //         email: e.currentTarget.elements.email.value,
        //         password: e.currentTarget.elements.password.value,
        //     })
        //     .then(res => console.log(res))
        //     .catch((error: any) => console.error(error.stack));

        setLoading(!loading);
    };

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
                    <label htmlFor="email">Email</label>
                    <input
                        autoComplete="false"
                        type="email"
                        name="email"
                        id="email"
                        placeholder="test@gmail.com"
                    />
                </div>

                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="********"
                    />
                </div>

                <div
                    css={{
                        marginBottom: '2rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',

                        '> *': {
                            flexBasis: '33.33%',
                            textAlign: 'center',
                        },
                    }}
                >
                    <div>
                        <PrimaryButton
                            css={{
                                padding: '.9em 2em',
                            }}
                        >
                            Log in
                            {loading ? <BtnLoader /> : null}
                        </PrimaryButton>
                    </div>

                    <span
                        css={{
                            fontSize: '2rem',
                            textTransform: 'uppercase',
                            color: theme.colors.greenGrey,
                        }}
                    >
                        or
                    </span>

                    <div>
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
                </div>

                <div>
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
