import React from 'react';
import { NavLink } from 'react-router-dom';

import { useUser } from '../../context/userContext';
import { StyledNav } from '../styled/Nav';

export const DashboardNav: React.FC = () => {
    const {
        state: { user },
        dispatch,
    } = useUser();

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
                <li>
                    <NavLink
                        className={({ isActive }) => (isActive ? 'active' : '')}
                        to="/dashboard"
                    >
                        Dashboard
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        className={({ isActive }) => (isActive ? 'active' : '')}
                        to="/recipes"
                    >
                        Recipes
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        className={({ isActive }) => (isActive ? 'active' : '')}
                        to="/dashboard/shoppinglists"
                    >
                        Shopping Lists
                    </NavLink>
                </li>
            </ul>
        </StyledNav>
    );
};
