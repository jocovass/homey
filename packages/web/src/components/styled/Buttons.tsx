import React from 'react';
import styled from '@emotion/styled';

import { hoverEffect } from '../../styles/theme';

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

    ${hoverEffect}

    &:disabled {
        cursor: not-allowed;
        opacity: 0.5;
    }
`;
