/** @jsxRuntime classic */
/** @jsx jsx */
// eslint-disable-next-line no-unused-vars
import { jsx, css } from '@emotion/react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import styled from '@emotion/styled';

import { useUser, updateProfile } from '../../context/userContext';
import { FieldGroup, FieldGroupInput, FieldGroupLabel } from '../atoms/form';
import { UpdateAvatar } from './UpdateAvatar';
import { PrimaryButton } from '../styled/Buttons';
import { BtnLoader } from '../styled/BtnLoader';

type MyDetailsFormFields = {
    firstName: string;
    lastName: string;
    email: string;
};

const schema = yup.object({
    email: yup.string().email('Invalid email address.'),
});

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
        reset,
        setError: setValidationError,
        formState: { errors: validationErrors, touchedFields, isValid },
    } = useForm<MyDetailsFormFields>({
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
        },
        resolver: yupResolver(schema, { abortEarly: false }),
        mode: 'all',
        criteriaMode: 'all',
    });

    const isLoading = status === 'pending';

    const onSubmit = (data: MyDetailsFormFields) => {
        updateProfile({
            email: data.email || undefined,
            firstName: data.firstName || undefined,
            lastName: data.lastName || undefined,
            dispatch,
        })
            .then(() => reset())
            .catch((error: any) => {
                if (typeof error.message === 'string') {
                    dispatch({
                        type: 'SET_ERROR',
                        payload: { error: error.message },
                    });

                    return;
                }

                error.errors.forEach(
                    (error: { [key: string]: string }, index: number) => {
                        let keys = Object.keys(error);
                        setValidationError(
                            keys[0] as 'email',
                            {
                                type: 'custom',
                                message: error[keys[0]],
                            },
                            { shouldFocus: index === 0 },
                        );
                    },
                );
            });
    };

    return (
        <StyledMyDetails>
            <h1>My Details</h1>

            <UpdateAvatar />

            <form onSubmit={handleSubmit(onSubmit)}>
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
                    disabled={isLoading || !isValid}
                >
                    Update
                    {isLoading ? <BtnLoader /> : null}
                </PrimaryButton>
            </form>
        </StyledMyDetails>
    );
};
