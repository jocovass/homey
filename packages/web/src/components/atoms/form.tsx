/** @jsxRuntime classic */
/** @jsx jsx */
// eslint-disable-next-line no-unused-vars
import { jsx, css, useTheme } from '@emotion/react';
import React, { InputHTMLAttributes, LabelHTMLAttributes } from 'react';
import styled from '@emotion/styled';
import { UseFormRegister, Path, DeepMap, FieldError } from 'react-hook-form';

/**
 * FieldGroup
 */

export const FieldGroup: React.FC = ({ children }) => {
    return <div css={{ marginBottom: '2rem' }}>{children}</div>;
};

/**
 * FieldGroupLabel
 */

const StyledFieldGroupLabel = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;

    label {
        display: block;
        font-size: 1.6rem;
        margin-bottom: 0.85rem;
    }

    .error {
        color: ${props => props.theme.colors.orangeRed};
        font-size: 1.2rem;
    }
`;

type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;
type FieldGroupLabelProps<FormValues> = {
    label: string;
    name: string;
    validationErrors?: Partial<DeepMap<FormValues, FieldError>>;
    touchedFields?: Partial<DeepMap<FormValues, boolean | undefined>>;
} & LabelProps;
export const FieldGroupLabel = <FormValues extends Record<string, unknown>>({
    label,
    name,
    touchedFields,
    validationErrors,
    ...rest
}: FieldGroupLabelProps<FormValues>) => {
    return (
        <StyledFieldGroupLabel>
            <label {...rest}>{label}</label>
            {touchedFields &&
            touchedFields[name] &&
            validationErrors &&
            validationErrors[name] ? (
                <p className="error">{validationErrors[name]?.message}</p>
            ) : null}
        </StyledFieldGroupLabel>
    );
};

/**
 * FieldGroupInput
 */

const StyledFieldGroupInput = styled.input`
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
`;

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'name'>;
type FieldGroupInputProps<FormValues> = {
    name: Path<FormValues>;
    register: UseFormRegister<FormValues>;
} & InputProps;

export const FieldGroupInput = <FormValues extends Record<string, unknown>>({
    register,
    name,
    ...rest
}: FieldGroupInputProps<FormValues>) => {
    return <StyledFieldGroupInput {...register(name)} {...rest} />;
};

/**
 * FieldGroupValidationGuide
 */

const StyledFieldGroupValidationGuide = styled.div`
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

type FieldGroupCalidationGuideProps = {
    validationList: string[];
    validationErrors: string[];
};
export const FieldGroupValidationGuide: React.FC<
    FieldGroupCalidationGuideProps
> = ({ validationList, validationErrors }) => {
    return (
        <StyledFieldGroupValidationGuide>
            <ul>
                {validationList.map((item, index) => {
                    return (
                        <li
                            className={
                                validationErrors.includes(item) ? '' : 'valid'
                            }
                            key={index}
                        >
                            {item}
                        </li>
                    );
                })}
            </ul>
        </StyledFieldGroupValidationGuide>
    );
};
