/** @jsxRuntime classic */
/** @jsx jsx */
// eslint-disable-next-line no-unused-vars
import { jsx, css } from '@emotion/react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import styled from '@emotion/styled';

import { useUser, updatePassword } from '../../context/userContext';
import {
    updatePasswordSchema,
    passwordValidationList,
} from '../../util/validations';
import { formatValidationError } from '../../util/utils';
import {
    FieldGroup,
    FieldGroupInput,
    FieldGroupLabel,
    FieldGroupValidationGuide,
} from '../atoms/form';
import { PrimaryButton } from '../styled/Buttons';
import { BtnLoader } from '../styled/BtnLoader';

type UpdatePasswordFormFields = {
    currentPassword: string;
    password: string;
    passwordConfirm: string;
};

const StyledUpdatePassword = styled.div`
    h1 {
        margin-bottom: 3rem;
    }

    form {
        max-width: 500px;
    }
`;

export const UpdatePassword: React.FC = () => {
    const {
        state: { status },
        dispatch,
    } = useUser();
    const {
        register,
        reset,
        setError: setValidationError,
        handleSubmit,
        formState: {
            errors: validationErrors,
            touchedFields,
            dirtyFields,
            isValid,
        },
    } = useForm<UpdatePasswordFormFields>({
        defaultValues: {
            currentPassword: '',
            password: '',
            passwordConfirm: '',
        },
        resolver: yupResolver(updatePasswordSchema, { abortEarly: false }),
        mode: 'all',
        criteriaMode: 'all',
    });
    const isLoading = status === 'pending';

    const onSubmit = (data: UpdatePasswordFormFields) => {
        updatePassword({
            currentPassword: data.currentPassword,
            password: data.password,
            passwordConfirm: data.passwordConfirm,
            dispatch,
        })
            .then(() => reset())
            .catch((error: any) => {
                if (typeof error.message === 'string') {
                    return;
                }

                error.errors.forEach(
                    (error: { [key: string]: string }, index: number) => {
                        let keys = Object.keys(error);
                        setValidationError(
                            keys[0] as keyof UpdatePasswordFormFields,
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

    const passwordErrors = formatValidationError(validationErrors);

    return (
        <StyledUpdatePassword>
            <h1>Update password</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <FieldGroup>
                    <FieldGroupLabel<UpdatePasswordFormFields>
                        label="Current password"
                        htmlFor="currentPassword"
                        name="currentPassword"
                        validationErrors={validationErrors}
                        touchedFields={touchedFields}
                    />

                    <FieldGroupInput<UpdatePasswordFormFields>
                        className={
                            touchedFields.currentPassword &&
                            validationErrors.currentPassword
                                ? 'error'
                                : ''
                        }
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        placeholder="*********"
                        register={register}
                    />
                </FieldGroup>

                <FieldGroup>
                    <FieldGroupLabel<UpdatePasswordFormFields>
                        label="New password"
                        htmlFor="password"
                        name="password"
                    />

                    <FieldGroupInput<UpdatePasswordFormFields>
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
                    <FieldGroupLabel<UpdatePasswordFormFields>
                        label="Confirm password"
                        htmlFor="passwordConfirm"
                        name="passwordConfirm"
                        validationErrors={validationErrors}
                        touchedFields={touchedFields}
                    />

                    <FieldGroupInput<UpdatePasswordFormFields>
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
        </StyledUpdatePassword>
    );
};
