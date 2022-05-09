/** @jsxRuntime classic */
/** @jsx jsx */
// eslint-disable-next-line no-unused-vars
import { jsx, css } from '@emotion/react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import styled from '@emotion/styled';

import { useUser } from '../../context/userContext';
import { FieldGroup, FieldGroupInput, FieldGroupLabel } from '../atoms/form';
import { UpdateAvatar } from './UpdateAvatar';
import { PrimaryButton } from '../styled/Buttons';
import { BtnLoader } from '../styled/BtnLoader';

type MyDetailsFormFields = {
    firstName: string;
    lastName: string;
    email: string;
};

const StyledMyDetails = styled.div`
    h1 {
        margin-bottom: 3rem;
    }

    form {
        max-width: 500px;
    }
`;

export const MyDetails: React.FC = () => {
    const {
        state: { user, status },
        dispatch,
    } = useUser();
    const {
        register,
        handleSubmit,
        setError: setValidationError,
        formState: { errors: validationErrors, touchedFields, isValid },
    } = useForm<MyDetailsFormFields>({
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
        },
        // resolver: yupResolver(loginSchema, { abortEarly: false }),
        mode: 'all',
        criteriaMode: 'all',
    });

    const isLoading = status === 'pending';

    return (
        <StyledMyDetails>
            <h1>My Details</h1>

            <UpdateAvatar />

            <form>
                <FieldGroup>
                    <FieldGroupLabel<MyDetailsFormFields>
                        label="First name"
                        htmlFor="firstName"
                        name="firstName"
                        validationErrors={validationErrors}
                        touchedFields={touchedFields}
                    />

                    <FieldGroupInput<MyDetailsFormFields>
                        className={
                            touchedFields.firstName &&
                            validationErrors.firstName
                                ? 'error'
                                : ''
                        }
                        id="firstName"
                        name="firstName"
                        type="text"
                        placeholder={user?.firstName}
                        register={register}
                    />
                </FieldGroup>

                <FieldGroup>
                    <FieldGroupLabel<MyDetailsFormFields>
                        label="Last name"
                        htmlFor="lastName"
                        name="lastName"
                        validationErrors={validationErrors}
                        touchedFields={touchedFields}
                    />

                    <FieldGroupInput<MyDetailsFormFields>
                        className={
                            touchedFields.email && validationErrors.email
                                ? 'error'
                                : ''
                        }
                        id="lastName"
                        name="lastName"
                        type="text"
                        placeholder={user?.lastName}
                        register={register}
                    />
                </FieldGroup>

                <FieldGroup>
                    <FieldGroupLabel<MyDetailsFormFields>
                        label="Email"
                        htmlFor="email"
                        name="email"
                        validationErrors={validationErrors}
                        touchedFields={touchedFields}
                    />

                    <FieldGroupInput<MyDetailsFormFields>
                        className={
                            touchedFields.email && validationErrors.email
                                ? 'error'
                                : ''
                        }
                        id="email"
                        name="email"
                        type="email"
                        placeholder={user?.email}
                        register={register}
                    />
                </FieldGroup>

                <PrimaryButton
                    css={{
                        padding: '.9em',
                        width: '15rem',
                    }}
                >
                    Update
                    {isLoading ? <BtnLoader /> : null}
                </PrimaryButton>
            </form>
        </StyledMyDetails>
    );
};
