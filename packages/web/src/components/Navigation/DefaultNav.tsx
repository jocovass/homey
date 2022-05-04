/** @jsxRuntime classic */
/** @jsx jsx */
// eslint-disable-next-line no-unused-vars
import { jsx, css } from '@emotion/react';
import React from 'react';
import { Link, NavLink } from 'react-router-dom';

import { logout } from '../../services/authService';
import { useUser } from '../../context/userContext';
import { StyledNav } from '../styled/Nav';
import { PrimaryButton } from '../styled/Buttons';

export const DefaultNav: React.FC = () => {
    const {
        state: { user },
        dispatch,
    } = useUser();

    const handleLogout = () => {
        logout({ dispatch });
    };

    return (
        <StyledNav>
            <ul>
                <li>
                    <NavLink
                        className={({ isActive }) => (isActive ? 'active' : '')}
                        to="/"
                    >
                        Home
                    </NavLink>
                </li>

                {user ? (
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
                ) : null}
            </ul>
            {user ? (
                <PrimaryButton
                    css={{ marginLeft: '2rem' }}
                    onClick={handleLogout}
                >
                    Log out
                </PrimaryButton>
            ) : (
                <PrimaryButton
                    css={{ marginLeft: '2rem' }}
                    as={Link}
                    to="/login"
                >
                    Log in / Sign up
                </PrimaryButton>
            )}
        </StyledNav>
    );
};
