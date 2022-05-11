import React from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

import { theme } from '../../styles/theme';

type StyledBtnLoaderProps = {
    loaderColour: keyof typeof theme.colors;
};

const ellipsis1 = keyframes`
    0% {
     transform: scale(0);
     }
     100% {
       transform: scale(1);
     }
     `;

const ellipsis2Small = keyframes`
    0% {
      transform: translate(0, 0);
    }
    100% {
      transform: translate(10px, 0);
    }
`;

const ellipsis2Medium = keyframes`
    0% {
      transform: translate(0, 0);
    }
    100% {
      transform: translate(15px, 0);
    }
`;

const ellipsis2Large = keyframes`
    0% {
      transform: translate(0, 0);
    }
    100% {
      transform: translate(30px, 0);
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

const StyledBtnLoader = styled.div<StyledBtnLoaderProps>`
    display: inline-block;
    position: relative;

    div {
        position: absolute;
        top: 0px;
        border-radius: 50%;
        background-color: ${props => props.theme.colors[props.loaderColour]};
        animation-timing-function: cubic-bezier(0, 1, 1, 0);
    }

    // Small
    &.small {
        width: 3rem;
        height: 0.6rem;
        margin-left: 0.4em;
    }

    &.small {
        div {
            width: 0.6rem;
            height: 0.6rem;
        }

        div:nth-of-type(1) {
            left: 0px;
            animation: ${ellipsis1} 0.6s infinite;
        }

        div:nth-of-type(2) {
            left: 0px;
            animation: ${ellipsis2Small} 0.6s infinite;
        }

        div:nth-of-type(3) {
            left: 10px;
            animation: ${ellipsis2Small} 0.6s infinite;
        }

        div:nth-of-type(4) {
            left: 22px;
            animation: ${ellipsis3} 0.6s infinite;
        }
    }

    // Medium
    &.medium {
        width: 4.5rem;
        height: 0.9rem;
    }

    &.medium {
        div {
            width: 0.9rem;
            height: 0.9rem;
        }

        div:nth-of-type(1) {
            left: 0px;
            animation: ${ellipsis1} 0.6s infinite;
        }

        div:nth-of-type(2) {
            left: 0px;
            animation: ${ellipsis2Medium} 0.6s infinite;
        }

        div:nth-of-type(3) {
            left: 15px;
            animation: ${ellipsis2Medium} 0.6s infinite;
        }

        div:nth-of-type(4) {
            left: 33px;
            animation: ${ellipsis3} 0.6s infinite;
        }
    }

    // Large
    &.large {
        width: 9rem;
        height: 1.8rem;
    }

    &.large {
        div {
            width: 1.8rem;
            height: 1.8rem;
        }

        div:nth-of-type(1) {
            left: 0px;
            animation: ${ellipsis1} 0.6s infinite;
        }

        div:nth-of-type(2) {
            left: 0px;
            animation: ${ellipsis2Large} 0.6s infinite;
        }

        div:nth-of-type(3) {
            left: 30px;
            animation: ${ellipsis2Large} 0.6s infinite;
        }

        div:nth-of-type(4) {
            left: 66px;
            animation: ${ellipsis3} 0.6s infinite;
        }
    }
`;

type BtnLoaderProps = {
    className?: 'small' | 'medium' | 'large';
} & Partial<StyledBtnLoaderProps>;
export const BtnLoader: React.FC<BtnLoaderProps> = ({
    loaderColour = 'greenLight',
    className = 'small',
}) => {
    return (
        <StyledBtnLoader loaderColour={loaderColour} className={className}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </StyledBtnLoader>
    );
};
