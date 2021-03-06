import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import styled from '@emotion/styled';
import {
    RiUserSettingsLine,
    RiKey2Line,
    RiMailSendLine,
    RiTeamLine,
    RiLogoutBoxLine,
} from 'react-icons/ri';

import { MyDetails } from '../../components/UserSettings/MyDetails';
import { UpdatePassword } from '../../components/UserSettings/UpdatePassword';
import { Members } from '../../components/UserSettings/Members';

const StyledUserSettings = styled.div`
    padding: 1.5rem 5vw;
    margin: 3rem 0;
    display: grid;
    grid-template-columns: minmax(min-content, 20%) 1fr;

    .side-col {
        grid-column: 1;
        border-right: 1px solid ${props => props.theme.colors.grey};

        nav {
            margin: 1.5rem 0;
        }

        ul {
            list-style: none;
        }

        li {
            margin-bottom: 1.3rem;
            width: 100%;
        }

        a,
        button {
            display: flex;
            align-items: center;
            text-decoration: none;
            position: relative;
            padding: 0.4rem 1.5rem;
            width: 100%;
            font-size: 1.4rem;
            color: ${props => props.theme.colors.grey};
            transition-property: color;
            transition-duration: 300ms;
            transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);

            svg {
                margin-right: 0.8rem;
            }

            &::before {
                content: '';
                background-color: ${props => props.theme.colors.greenAccent};
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                width: 5px;
                border-radius: 0 10px 10px 0;
                transform-origin: left;
                transform: scaleX(0);
                transition-property: transform;
                transition-duration: 300ms;
                transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
            }

            &.active,
            &:hover {
                color: ${props => props.theme.colors.greenAccent};
            }

            &.active::before,
            &:hover::before {
                transform: scaleX(1);
            }
        }
    }

    .content {
        /* background-color: orangered; */
        grid-column: 2;
        padding-left: 3.5rem;
    }
`;

export const UserSettings: React.FC = () => {
    return (
        <StyledUserSettings>
            <aside className="side-col">
                <h3>Settings</h3>
                <nav>
                    <ul>
                        <li>
                            <NavLink end to="/dashboard/settings">
                                <RiUserSettingsLine />
                                My details
                            </NavLink>
                        </li>
                        <li>
                            <NavLink end to="/dashboard/settings/password">
                                <RiKey2Line />
                                Password
                            </NavLink>
                        </li>
                        <li>
                            <NavLink end to="/dashboard/settings/members">
                                <RiTeamLine />
                                Members
                            </NavLink>
                        </li>
                        <li>
                            <button>
                                <RiLogoutBoxLine />
                                Log out
                            </button>
                        </li>
                    </ul>
                </nav>
            </aside>

            <div className="content">
                <Routes>
                    <Route index element={<MyDetails />} />
                    <Route path="/password" element={<UpdatePassword />} />
                    <Route path="/members" element={<Members />} />
                </Routes>
            </div>
        </StyledUserSettings>
    );
};
