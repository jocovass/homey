/** @jsxRuntime classic */
/** @jsx jsx */
// eslint-disable-next-line no-unused-vars
import { jsx, css } from '@emotion/react';
import { Link, NavLink } from 'react-router-dom';
import styled from '@emotion/styled';

import { logout } from '../../services/authService';
import { useUser } from '../../context/userContext';
import { Logo } from '../styled/Logo';
import { PrimaryButton } from '../styled/Buttons';

const StyledHeader = styled.header`
    padding: 1.5rem 5vw;
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;

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
    const {
        state: { user },
        dispatch,
    } = useUser();

    const handleLogout = () => {
        logout({ dispatch });
    };

    return (
        <StyledHeader>
            <Logo />
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
                    <li>
                        <NavLink
                            className={({ isActive }) =>
                                isActive ? 'active' : ''
                            }
                            to="/dashboard"
                        >
                            Dashboard
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            className={({ isActive }) =>
                                isActive ? 'active' : ''
                            }
                            to="/recipes"
                        >
                            Recipes
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            className={({ isActive }) =>
                                isActive ? 'active' : ''
                            }
                            to="/shoppinglist"
                        >
                            Shoppinglist
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </StyledHeader>
    );
};
