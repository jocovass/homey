import React from 'react';
import styled from '@emotion/styled';

const StyledLogo = styled.div`
    height: 4.5rem;
    width: 4.5rem;
    border-radius: 50%;
    background-image: linear-gradient(to right, #fff 0%, #fff 50%, #000 50%);
    position: relative;
    font-size: 3.3rem;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;

    span {
        color: #fff;
        mix-blend-mode: exclusion;
    }
`;

export const Logo: React.FC = () => (
    <StyledLogo>
        <span>H</span>
    </StyledLogo>
);
