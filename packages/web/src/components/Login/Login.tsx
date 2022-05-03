/** @jsxRuntime classic */
/** @jsx jsx */
// eslint-disable-next-line no-unused-vars
import { jsx, css } from '@emotion/react';
import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { GoChevronRight } from 'react-icons/go';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { useUser } from '../../context/userContext';
import { login } from '../../services/authService';
import { FieldGroup, FieldGroupInput, FieldGroupLabel } from '../atoms/form';
import { AuthForm } from '../styled/AuthForm';
import { PrimaryButton } from '../styled/Buttons';
import { BtnLoader } from '../styled/BtnLoader';

// interface FormElements extends HTMLFormControlsCollection {
//     email: HTMLInputElement;
//     password: HTMLInputElement;
// }

// interface LoginFormElement extends HTMLFormElement {
//     readonly elements: FormElements;
// }

type LoginFormFields = {
    email: string;
    password: string;
};

const schema = yup.object({
    email: yup
        .string()
        .required('Email is required.')
        .email('Invalid email address.'),
    password: yup
        .string()
        .required('Password is required.')
        .min(8, 'Must be 8 characters minimum.'),
});

export const Login = () => {
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
        formState: { errors: validationErrors, touchedFields, isValid },
    } = useForm<LoginFormFields>({
        defaultValues: {
            email: '',
            password: '',
        },
        resolver: yupResolver(schema, { abortEarly: false }),
        mode: 'all',
        criteriaMode: 'all',
    });

    const isLoading = status === 'pending';
    const isError = status === 'error';

    const onSubmit = (data: LoginFormFields) => {
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

    if (user) {
        return <Navigate to="/" replace />;
    }

    return (
        <AuthForm>
            <div className="header">
                <h1 className="title">Log in</h1>
                <p className="subtitle">
                    Welcome back, log in to see what is happening in your
                    household.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <FieldGroup>
                    <FieldGroupLabel<LoginFormFields>
                        label="Email"
                        htmlFor="email"
                        name="email"
                        validationErrors={validationErrors}
                        touchedFields={touchedFields}
                    />

                    <FieldGroupInput<LoginFormFields>
                        className={
                            touchedFields.email && validationErrors.email
                                ? 'error'
                                : ''
                        }
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@gmail.com"
                        register={register}
                    />
                </FieldGroup>

                <FieldGroup>
                    <FieldGroupLabel<LoginFormFields>
                        label="Passowrd"
                        htmlFor="password"
                        name="password"
                        validationErrors={validationErrors}
                        touchedFields={touchedFields}
                    />

                    <FieldGroupInput<LoginFormFields>
                        className={
                            touchedFields.password && validationErrors.password
                                ? 'error'
                                : ''
                        }
                        id="password"
                        name="password"
                        type="password"
                        placeholder="**********"
                        register={register}
                    />
                </FieldGroup>

                <div className="flex">
                    <PrimaryButton
                        css={{
                            padding: '.9em',
                            width: '15rem',
                        }}
                        disabled={isLoading || !isValid}
                    >
                        Log in
                        {isLoading ? <BtnLoader /> : null}
                    </PrimaryButton>

                    <span className="or">or</span>

                    <Link className="link-to-form" to="/signup">
                        <span>Sign up here</span>
                        <GoChevronRight />
                    </Link>
                </div>

                {isError ? <p className="form-error">{error}</p> : null}

                <div className="forgot-password">
                    <Link to="/reset-password">Forgot your password?</Link>
                </div>
            </form>
        </AuthForm>
    );
};
