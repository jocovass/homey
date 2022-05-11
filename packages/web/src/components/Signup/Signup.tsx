/** @jsxRuntime classic */
/** @jsx jsx */
// eslint-disable-next-line no-unused-vars
import { jsx, css } from '@emotion/react';
import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { GoChevronRight } from 'react-icons/go';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { useUser } from '../../context/userContext';
import { signup } from '../../services/authService';
import { signupSchema, passwordValidationList } from '../../util/validations';
import { formatValidationError } from '../../util/utils';
import {
    FieldGroup,
    FieldGroupInput,
    FieldGroupLabel,
    FieldGroupValidationGuide,
} from '../atoms/form';
import { AuthForm } from '../styled/AuthForm';
import { PrimaryButton } from '../styled/Buttons';
import { BtnLoader } from '../styled/BtnLoader';

type SignupFormFields = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    passwordConfirm: string;
};

export const Signup = () => {
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
        formState: {
            errors: validationErrors,
            isValid,
            touchedFields,
            dirtyFields,
        },
    } = useForm<SignupFormFields>({
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            passwordConfirm: '',
        },
        resolver: yupResolver(signupSchema, { abortEarly: false }),
        mode: 'all',
        criteriaMode: 'all',
    });

    const isLoading = status === 'pending';
    const isError = status === 'error';

    const onSubmit = (data: SignupFormFields) => {
        setState({ status: 'pending', error: null });
        signup({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: data.password,
            passwordConfirm: data.passwordConfirm,
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
                            keys[0] as keyof SignupFormFields,
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

    if (user) {
        return <Navigate to="/" replace />;
    }

    return (
        <AuthForm>
            <div className="header">
                <h1 className="title">Sign up</h1>
                <p className="subtitle">
                    Welcome, sign up and join a household or create your own.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <FieldGroup>
                    <FieldGroupLabel<SignupFormFields>
                        label="First name"
                        htmlFor="firstName"
                        name="firstName"
                        validationErrors={validationErrors}
                        touchedFields={touchedFields}
                    />

                    <FieldGroupInput<SignupFormFields>
                        className={
                            touchedFields.firstName &&
                            validationErrors.firstName
                                ? 'error'
                                : ''
                        }
                        id="firstName"
                        name="firstName"
                        type="text"
                        placeholder="John"
                        register={register}
                    />
                </FieldGroup>

                <FieldGroup>
                    <FieldGroupLabel<SignupFormFields>
                        label="Last name"
                        htmlFor="lastName"
                        name="lastName"
                        validationErrors={validationErrors}
                        touchedFields={touchedFields}
                    />

                    <FieldGroupInput<SignupFormFields>
                        className={
                            touchedFields.lastName && validationErrors.lastName
                                ? 'error'
                                : ''
                        }
                        id="lastName"
                        name="lastName"
                        type="text"
                        placeholder="Smith"
                        register={register}
                    />
                </FieldGroup>

                <FieldGroup>
                    <FieldGroupLabel<SignupFormFields>
                        label="Email"
                        htmlFor="email"
                        name="email"
                        validationErrors={validationErrors}
                        touchedFields={touchedFields}
                    />

                    <FieldGroupInput<SignupFormFields>
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
                    <FieldGroupLabel<SignupFormFields>
                        label="Password"
                        htmlFor="password"
                        name="password"
                    />

                    <FieldGroupInput<SignupFormFields>
                        className={
                            touchedFields.password && validationErrors.password
                                ? 'error'
                                : ''
                        }
                        id="password"
                        name="password"
                        type="password"
                        placeholder="*********"
                        register={register}
                    />

                    {touchedFields.password || dirtyFields.password ? (
                        <FieldGroupValidationGuide
                            validationErrors={passwordErrors}
                            validationList={passwordValidationList}
                        />
                    ) : null}
                </FieldGroup>

                <FieldGroup>
                    <FieldGroupLabel<SignupFormFields>
                        label="Confirm Password"
                        htmlFor="passwordConfirm"
                        name="passwordConfirm"
                        validationErrors={validationErrors}
                        touchedFields={touchedFields}
                    />

                    <FieldGroupInput<SignupFormFields>
                        className={
                            touchedFields.passwordConfirm &&
                            validationErrors.passwordConfirm
                                ? 'error'
                                : ''
                        }
                        id="passwordConfirm"
                        name="passwordConfirm"
                        type="password"
                        placeholder="*********"
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
                        Sign up
                        {isLoading ? <BtnLoader /> : null}
                    </PrimaryButton>

                    <span className="or">or</span>

                    <Link className="link-to-form" to="/login">
                        <span>Log in here</span>
                        <GoChevronRight />
                    </Link>
                </div>

                {isError ? <div className="form-error">{error}</div> : null}
            </form>
        </AuthForm>
    );
};
