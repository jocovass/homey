import React from 'react';
import styled from '@emotion/styled';

import { Logo } from '../styled/Logo';

const StyledHeader = styled.header`
    padding: 1.5rem 5vw;
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

export const Header: React.FC = ({ children }) => {
    return (
        <StyledHeader>
            <Logo />
            {children}
        </StyledHeader>
    );
};
