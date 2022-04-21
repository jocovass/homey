import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const ellipsis1 = keyframes`
    0% {
     transform: scale(0);
     }
     100% {
       transform: scale(1);
     }
     `;

const ellipsis2 = keyframes`
    0% {
      transform: translate(0, 0);
    }
    100% {
      transform: translate(10px, 0);
    }
`;

const ellipsis3 = keyframes`
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(0);
    }
`;

const StyledBtnLoader = styled.div`
    display: inline-block;
    position: relative;
    width: 3rem;
    height: 0.6rem;
    margin-left: 1rem;

    div {
        position: absolute;
        top: 0px;
        width: 0.6rem;
        height: 0.6rem;
        border-radius: 50%;
        background-color: ${props => props.theme.colors.greenLight};
        animation-timing-function: cubic-bezier(0, 1, 1, 0);
    }

    div:nth-of-type(1) {
        left: 0px;
        animation: ${ellipsis1} 0.6s infinite;
    }

    div:nth-of-type(2) {
        left: 0px;
        animation: ${ellipsis2} 0.6s infinite;
    }

    div:nth-of-type(3) {
        left: 10px;
        animation: ${ellipsis2} 0.6s infinite;
    }

    div:nth-of-type(4) {
        left: 22px;
        animation: ${ellipsis3} 0.6s infinite;
    }
`;

export const BtnLoader = () => (
    <StyledBtnLoader>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </StyledBtnLoader>
);
