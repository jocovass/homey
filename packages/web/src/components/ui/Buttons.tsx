import React from 'react';
import styled from '@emotion/styled';

interface PrimaryButtonProps {
    as?: string | React.ElementType<any>;
    to?: string;
}
export const PrimaryButton = styled.button<PrimaryButtonProps>`
    text-decoration: none;
    background-color: ${props => props.theme.colors.greenAccent};
    color: ${props => props.theme.colors.greenLight};
    border-radius: 100px;
    font-size: 1.5rem;
    font-weight: 600;
    padding: 0.4em 1.3em;
    transition-property: box-shadow;
    transition-duration: 300ms;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);

    &:hover,
    &:focus,
    &:focus-visible {
        box-shadow: 0 0 0 0.1em ${props => props.theme.colors.greenLighter},
            0 0 0 0.2em ${props => props.theme.colors.greenAccent};
        outline: 0;
    }
`;
