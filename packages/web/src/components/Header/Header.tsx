/** @jsxRuntime classic */
/** @jsx jsx */
// eslint-disable-next-line no-unused-vars
import { jsx, css } from '@emotion/react';
import { Link, NavLink } from 'react-router-dom';
import styled from '@emotion/styled';

import { PrimaryButton } from '../styled/Buttons';

const StyledHeader = styled.header`
    padding: 1.5rem 5vw;
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .logo {
        height: 4.5rem;
        width: 4.5rem;
        border-radius: 50%;
        background-image: linear-gradient(
            to right,
            #fff 0%,
            #fff 50%,
            #000 50%
        );
        /* background-image: ${props =>
            `linear-gradient(to right, ${props.theme.colors.greenLight} 0%, ${props.theme.colors.greenLight} 50%, #000 50%)`}; */
        position: relative;
        font-size: 3.3rem;
        font-weight: bold;
        display: flex;
        justify-content: center;
        align-items: center;

        span {
            color: #fff;
            /* color: ${props => props.theme.colors.greenLight}; */
            mix-blend-mode: exclusion;
        }
    }

    nav {
        display: flex;
        align-items: center;
    }

    ul {
        display: flex;
        align-items: center;
        list-style: none;
    }

    li:not(:last-of-type) {
        margin-right: 2rem;
    }

    li a {
        display: inline-block;
        font-size: 1.6rem;
        font-weight: 600;
        color: ${props => props.theme.colors.greenDark};
        text-decoration: none;
        position: relative;
        padding: 0.4em;
        transition-property: color;
        transition-duration: 300ms;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);

        &::after {
            content: '';
            position: absolute;
            bottom: 0px;
            left: 50%;
            height: 3px;
            width: 17px;
            background-color: ${props => props.theme.colors.greenAccent};
            transform-origin: center;
            transform: translateX(-50%) scaleX(0);
            transition-property: transform;
            transition-duration: 300ms;
            transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }

        &:hover,
        &.active {
            color: ${props => props.theme.colors.greenAccent};
        }

        &:hover::after,
        &.active::after {
            transform: translateX(-50%) scaleX(1);
        }
    }
`;

export const Header = () => {
    return (
        <StyledHeader>
            <div className="logo">
                <span>H</span>
            </div>
            <nav>
                <ul>
                    <li>
                        <NavLink
                            className={({ isActive }) =>
                                isActive ? 'active' : ''
                            }
                            to="/"
                        >
                            Home
                        </NavLink>
                    </li>
                </ul>
                <PrimaryButton
                    css={{ marginLeft: '2rem' }}
                    as={Link}
                    to="/login"
                >
                    Log in / Sign up
                </PrimaryButton>
            </nav>
        </StyledHeader>
    );
};
