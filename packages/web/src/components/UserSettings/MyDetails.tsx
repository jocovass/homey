/** @jsxRuntime classic */
/** @jsx jsx */
// eslint-disable-next-line no-unused-vars
import { jsx, css } from '@emotion/react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import styled from '@emotion/styled';
import { RiPencilLine, RiCheckLine } from 'react-icons/ri';
import {
    AdvancedImage,
    lazyload,
    responsive,
    accessibility,
} from '@cloudinary/react';
import { Cloudinary } from '@cloudinary/url-gen';
import { Resize, thumbnail, scale } from '@cloudinary/url-gen/actions/resize';
import { focusOn } from '@cloudinary/url-gen/qualifiers/gravity';
import { FocusOn } from '@cloudinary/url-gen/qualifiers/focusOn';

import { useUser } from '../../context/userContext';
import { FieldGroup, FieldGroupInput, FieldGroupLabel } from '../atoms/form';
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

const StyledUpdateAvatar = styled.div`
    margin-bottom: 3rem;

    .avatar {
        width: 15rem;
        height: 15rem;
        position: relative;

        &__image {
            display: block;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            overflow: hidden;

            img {
                /* width: 100%; */
            }
        }

        &__btn {
            display: flex;
            align-items: center;
            position: absolute;
            right: 10px;
            bottom: 10px;
            padding: 0.3em 0.5em;
            border-radius: 50px;
            background-color: #fff;
            border: 1px solid ${props => props.theme.colors.greenLighter};
            font-size: 1.2rem;
            color: ${props => props.theme.colors.black};
            transition-property: box-shadow;
            transition-duration: 300ms;
            transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);

            &:hover,
            &:focus,
            &:focus-visible {
                box-shadow: 0 0 0 0.15em black, 0 0 0 0.3em #fff;
                outline: 0;
            }

            svg,
            img {
                margin-right: 0.2rem;
            }
        }
    }
`;
export const UpdateAvatar = () => {
    const {
        state: { user, status },
        dispatch,
    } = useUser();

    const cld = new Cloudinary({
        cloud: {
            cloudName: 'jozsefvass',
        },
    });
    // users_profile/homey-avatar_z2qrx8
    // cld.image returns a CloudinaryImage with the configuration set.
    const myImage = cld.image(user?.avatar);
    myImage.resize(
        thumbnail().width(100).height(100).gravity(focusOn(FocusOn.face())),
    );

    return (
        <StyledUpdateAvatar>
            <div className="avatar">
                <span className="avatar__image">
                    <AdvancedImage
                        cldImg={myImage}
                        plugins={[lazyload(), responsive(), accessibility()]}
                    />
                </span>

                <button className="avatar__btn">
                    <RiPencilLine />
                    Edit
                </button>
            </div>
        </StyledUpdateAvatar>
    );
};
